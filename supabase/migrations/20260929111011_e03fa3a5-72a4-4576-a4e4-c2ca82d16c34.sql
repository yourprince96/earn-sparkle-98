REVOKE EXECUTE ON FUNCTION public.claim_task(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.request_withdrawal(text,text,numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.review_withdrawal(uuid,boolean,text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.today_earning() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_stats() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_columns() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;