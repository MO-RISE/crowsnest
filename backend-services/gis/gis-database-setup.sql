-- Create an 'web_anon' role with only reading permissions. 
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'web_anon') THEN
        CREATE ROLE web_anon NOLOGIN;
        GRANT USAGE ON SCHEMA public TO web_anon;
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO web_anon;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO web_anon;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO web_anon;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO web_anon;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO web_anon;
    END IF;
END
$$;

-- Functions to access GIS data
CREATE OR REPLACE FUNCTION public.get_obstacles(params json) RETURNS json
    LANGUAGE sql
    AS $_$
        WITH chart AS (           
        SELECT 
            name, scale
        FROM
            m_covr
        WHERE
            ST_Covers(
                geom,
                ST_GeomFromGeoJSON(params->>'area_geom')
            )
        ORDER BY 
            scale
        LIMIT 1
    )
    SELECT CASE
        WHEN
            (SELECT count(chart.name) FROM chart) < 1
        THEN
            '{"message": "Analyzed area not entirely within a chart."}'::json
        ELSE (
            SELECT ( 
                SELECT
                    (ST_AsGeoJSON(t.*)::json)
                FROM (
                    VALUES (
                        ST_Collect(ST_Intersection(obstacles.geom::geometry,ST_GeomFromGeoJSON(params->>'area_geom')))
                    )
                ) AS t(geom)
            )
            FROM (
                SELECT 
                    geom, chart.scale
                FROM 
                    coalne, chart 
                WHERE 
                    ST_Intersects(
                        geom,
                        ST_GeomFromGeoJSON(params->>'area_geom')
                    )
                AND 
                    coalne.name = chart.name
                UNION
                SELECT 
                    geom, chart.scale
                FROM 
                    depcnt, chart
                WHERE 
                    ST_Intersects(
                        geom,
                        ST_GeomFromGeoJSON(params->>'area_geom')
                    ) 
                AND 
                    valdco <= (params->>'draft')::numeric
                AND 
                    depcnt.name = chart.name
                UNION 
                SELECT 
                    geom, chart.scale
                FROM 
                    slcons, chart
                WHERE
                    ST_Intersects(
                        geom,
                        ST_GeomFromGeoJSON(params->>'area_geom')
                    )   
                AND 
                    slcons.name = chart.name
            ) AS obstacles
        )
    END
$_$;
