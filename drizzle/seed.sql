-- Initial changelog entry
INSERT INTO changelog (version, release_date, changes)
VALUES (
  '1.0.0',
  CURRENT_DATE,
  ARRAY[
    'Lanzamiento inicial de la aplicación',
    'Formulario de evaluación de tortas fritas',
    'Ranking de restaurantes por puntuación',
    'Mapa de locales con geolocalización',
    'Panel de administración',
    'Formulario de sugerencia de nuevos locales'
  ]
);

-- NOTE: Create the admin user by visiting /admin/setup on first launch.
-- This page is only accessible if no admin users exist yet.
