-- Insere perfis para usuários que já existem em auth.users mas não têm um registro correspondente na tabela profiles
-- Útil para usuários criados antes da implementação da trigger on_auth_user_created

INSERT INTO public.profiles (id, email, name, role, allowed_routes)
SELECT 
  u.id, 
  u.email, 
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  CASE WHEN u.email = 'johnnyoliveira@gmail.com' THEN 'admin' ELSE 'user' END,
  CASE WHEN u.email = 'johnnyoliveira@gmail.com' THEN '{"*"}' ELSE '{"/"}' END
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
