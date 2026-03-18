ALTER TABLE public.ala_private_membros 
ADD COLUMN tipo TEXT NOT NULL DEFAULT 'Titular' CHECK (tipo IN ('Titular', 'Cônjuge', 'Filho')),
ADD COLUMN titular_id UUID REFERENCES public.ala_private_membros(id) ON DELETE CASCADE;

ALTER TABLE public.ala_private_membros
ADD CONSTRAINT chk_ala_private_membros_hierarquia 
CHECK (
  (tipo = 'Titular' AND titular_id IS NULL) OR 
  (tipo != 'Titular' AND titular_id IS NOT NULL)
);
