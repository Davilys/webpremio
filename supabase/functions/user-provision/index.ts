import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ProvisionSelfBody = {
  action: "provision_self";
};

type AdminCreateUserBody = {
  action: "admin_create_user";
  nome: string;
  email: string;
  password: string;
};

type Body = ProvisionSelfBody | AdminCreateUserBody;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Configuração do backend ausente." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Não autenticado." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as Partial<Body>;

    if (body.action === "provision_self") {
      const user = userData.user;
      const userId = user.id;
      const email = user.email ?? "";
      const nome = (user.user_metadata as any)?.nome ?? email;

      // Create/Update profile
      const { error: profileUpsertError } = await adminClient
        .from("profiles")
        .upsert({ id: userId, email, nome }, { onConflict: "id" });

      if (profileUpsertError) {
        return new Response(JSON.stringify({ error: profileUpsertError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Ensure role exists
      const { data: existingRole } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (!existingRole?.role) {
        const { count } = await adminClient
          .from("user_roles")
          .select("id", { count: "exact", head: true });

        const roleToAssign = (count ?? 0) === 0 ? "admin" : "funcionario";

        const { error: roleInsertError } = await adminClient
          .from("user_roles")
          .insert({ user_id: userId, role: roleToAssign });

        if (roleInsertError) {
          return new Response(JSON.stringify({ error: roleInsertError.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ ok: true, role: roleToAssign }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: true, role: existingRole.role }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "admin_create_user") {
      const { nome, email, password } = body as AdminCreateUserBody;

      if (!nome || !email || !password) {
        return new Response(JSON.stringify({ error: "Dados inválidos." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check admin role for caller
      const { data: callerRole } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (callerRole?.role !== "admin") {
        return new Response(JSON.stringify({ error: "Acesso negado." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome },
      });

      if (createError || !created.user) {
        return new Response(JSON.stringify({ error: createError?.message ?? "Erro ao criar usuário." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const newUserId = created.user.id;

      const { error: profileUpsertError } = await adminClient
        .from("profiles")
        .upsert({ id: newUserId, email, nome }, { onConflict: "id" });

      if (profileUpsertError) {
        return new Response(JSON.stringify({ error: profileUpsertError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: roleInsertError } = await adminClient
        .from("user_roles")
        .insert({ user_id: newUserId, role: "funcionario" });

      if (roleInsertError) {
        return new Response(JSON.stringify({ error: roleInsertError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: true, user_id: newUserId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ação não suportada." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
