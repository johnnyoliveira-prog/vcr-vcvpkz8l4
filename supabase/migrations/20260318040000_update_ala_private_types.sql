-- Update existing records to the new primary type
UPDATE public.ala_private_membros 
SET tipo = 'ALA PRIVATE' 
WHERE tipo = 'Titular';

-- Drop constraints to recreate them
ALTER TABLE public.ala_private_membros 
DROP CONSTRAINT IF EXISTS chk_ala_private_membros_hierarquia,
DROP CONSTRAINT IF EXISTS ala_private_membros_tipo_check;

-- Alter column default to match the new main type
ALTER TABLE public.ala_private_membros 
ALTER COLUMN tipo SET DEFAULT 'ALA PRIVATE';

-- Add the check constraint for valid types
ALTER TABLE public.ala_private_membros 
ADD CONSTRAINT ala_private_membros_tipo_check 
CHECK (tipo IN ('ALA PRIVATE', 'membro ALA', 'membro ALA PRIVATE WINE', 'Cônjuge', 'Filho'));

-- Add the check constraint for hierarchy
ALTER TABLE public.ala_private_membros 
ADD CONSTRAINT chk_ala_private_membros_hierarquia 
CHECK (
  (tipo IN ('ALA PRIVATE', 'membro ALA', 'membro ALA PRIVATE WINE') AND titular_id IS NULL) OR 
  (tipo IN ('Cônjuge', 'Filho') AND titular_id IS NOT NULL)
);
