

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."events_count_by_categories"("category_id" integer) RETURNS TABLE("count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS count
  FROM
    events
  WHERE
    "isActive" = true AND
    "categoryId" = category_id;
END;
$$;


ALTER FUNCTION "public"."events_count_by_categories"("category_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_active_movies_count"() RETURNS TABLE("movies_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT "id") AS movies_count
  FROM
    movies
  WHERE
    "isActive" = TRUE;
END;
$$;


ALTER FUNCTION "public"."get_active_movies_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_active_theatres_count"() RETURNS TABLE("theatres_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS theatres_count
  FROM
    theatres
  WHERE
    "isActive" = TRUE;
END;
$$;


ALTER FUNCTION "public"."get_active_theatres_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_event_seats_count"("venue_id" integer) RETURNS TABLE("event_seats_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS event_seats_count
  FROM
    seats_events
  WHERE
    "venueId" = venue_id;
END;
$$;


ALTER FUNCTION "public"."get_all_event_seats_count"("venue_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_seats_count"("screen_id" integer) RETURNS TABLE("seats_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS seats_count
  FROM
    seats
  WHERE
    "screenId" = screen_id;
END;
$$;


ALTER FUNCTION "public"."get_all_seats_count"("screen_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_seats_counts"("screen_id" integer) RETURNS TABLE("ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS seats_count
  FROM
    seats
  WHERE
    "screenId" = screen_id;
END;
$$;


ALTER FUNCTION "public"."get_all_seats_counts"("screen_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_shows_count"() RETURNS TABLE("shows_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS shows_count
  FROM
    shows;
END;
$$;


ALTER FUNCTION "public"."get_all_shows_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_theatres_count"() RETURNS TABLE("theatres_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS theatres_count
  FROM
    theatres;
END;
$$;


ALTER FUNCTION "public"."get_all_theatres_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "seatId" "text" NOT NULL,
    "showId" bigint NOT NULL,
    "theatreId" bigint NOT NULL,
    "movieId" bigint NOT NULL,
    "bookedBy" "text",
    "totalPrice" "text",
    "referenceId" "text",
    "price" numeric
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_tickets"() RETURNS SETOF "public"."tickets"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY SELECT * FROM tickets;
END;
$$;


ALTER FUNCTION "public"."get_all_tickets"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_booked_event_seats_count"("event_id" integer) RETURNS TABLE("booked_event_seats_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS booked_event_seats_count
  FROM
    tickets_events
  WHERE
    "eventId" = event_id;
END;
$$;


ALTER FUNCTION "public"."get_booked_event_seats_count"("event_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_booked_seats_count"("show_id" integer) RETURNS TABLE("booked_seats_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS booked_seats_count
  FROM
    tickets
  WHERE
    "showId" = show_id;
END;
$$;


ALTER FUNCTION "public"."get_booked_seats_count"("show_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_booked_ticket_counts"("zone_id" integer, "event_id" integer) RETURNS TABLE("booked_ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS booked_ticket_count
  FROM
    tickets_events
  WHERE
    "zoneId" = zone_id AND
    "eventId" = event_id;
END;
$$;


ALTER FUNCTION "public"."get_booked_ticket_counts"("zone_id" integer, "event_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_booked_tickets_count"("event_id" integer) RETURNS TABLE("count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS count
  FROM
    tickets_events
  WHERE
    "isActive" = true AND
    "eventId" = event_id;
END;
$$;


ALTER FUNCTION "public"."get_booked_tickets_count"("event_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_booked_tickets_count"("zone_id" integer, "event_id" integer) RETURNS TABLE("category_id" integer, "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    "categoryId"::INT AS category_id,
    COUNT(*)::BIGINT AS count
  FROM
    tickets_events
  WHERE
    "isActive" = true AND
    "zoneId" = zone_id AND
    "eventId" = event_id
  GROUP BY
    "categoryId";
END;
$$;


ALTER FUNCTION "public"."get_booked_tickets_count"("zone_id" integer, "event_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_booked_tickets_count_test"("zone_id" integer, "event_id" integer) RETURNS TABLE("category_id" integer, "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    "categoryId"::INT AS category_id,
    COUNT(*)::BIGINT AS count
  FROM
    tickets_events
  WHERE
    "zoneId" = zone_id AND
    "eventId" = event_id
  GROUP BY
    "categoryId";
END;
$$;


ALTER FUNCTION "public"."get_booked_tickets_count_test"("zone_id" integer, "event_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_event_ticket_count"("eventorganization_id" integer) RETURNS TABLE("date" "date", "ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS date,
    COUNT(*) AS ticket_count
  FROM
    tickets_events
  WHERE
    "eventOrganizationId" = eventorganization_id AND
    created_at >= NOW() - INTERVAL '7 days' AND
    created_at <= NOW()
  GROUP BY
    date_trunc('day', created_at)::date
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_event_ticket_count"("eventorganization_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_event_ticket_counts"("eventorganization_id" integer) RETURNS TABLE("date" "date", "ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS date,
    COUNT(*) AS ticket_count
  FROM
    tickets
  WHERE
    "eventOrganizationId" = eventOrganization_Id AND
    created_at >= NOW() - INTERVAL '7 days' AND
    created_at <= NOW()
  GROUP BY
    date_trunc('day', created_at)::date
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_event_ticket_counts"("eventorganization_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_grouped_tickets"("theatre_id" integer) RETURNS TABLE("reference_id" "text", "tickets" "jsonb")
    LANGUAGE "plpgsql"
    AS $$ 
BEGIN 
  RETURN QUERY 
  SELECT 
    "referenceId", 
    jsonb_agg( 
      jsonb_build_object( 
        'id', id, 
        'theatreId', "theatreId", 
        'created_at', created_at 
      ) ORDER BY created_at 
    ) AS tickets 
  FROM 
    tickets 
  WHERE 
    "theatreId" = theatre_id 
  GROUP BY 
    "referenceId" 
  ORDER BY 
    MIN(created_at); 
END; 
$$;


ALTER FUNCTION "public"."get_grouped_tickets"("theatre_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_last_five_theatres"() RETURNS TABLE("theatreid" bigint, "theatrename" "text", "last_booking_date" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    t."id" AS theatreId,
    t.name AS theatreName,
     (
      SELECT to_char(ti.created_at, 'DD-MM-YYYY hh:mi AM')
      FROM tickets ti
      WHERE ti."theatreId" = t."id"
      ORDER BY ti.created_at DESC
      LIMIT 1
    ) AS last_booking_date
  FROM
    theatres t
  ORDER BY
    t.created_at DESC
  LIMIT 7;
END;
$$;


ALTER FUNCTION "public"."get_last_five_theatres"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_last_ten_tickets"() RETURNS TABLE("theatreid" bigint, "theatrename" "text", "movieid" bigint, "movietitle" "text", "bookedby" "text", "created_at" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    t."theatreId",
    th.name AS theatreName,
    t."movieId",
    m.title AS movieTitle,
    t."bookedBy",
    to_char(t.created_at, 'DD-MM-YYYY hh:mi AM') AS created_at
  FROM
    tickets t
  JOIN
    theatres th ON t."theatreId" = th.id
  JOIN
    movies m ON t."movieId" = m.id
  ORDER BY
    t.created_at DESC
  LIMIT 10;
END;
$$;


ALTER FUNCTION "public"."get_last_ten_tickets"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_movies_count"() RETURNS TABLE("movies_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT "movieId") AS movies_count
  FROM
    shows
  WHERE
    "isActive" = TRUE;
END;
$$;


ALTER FUNCTION "public"."get_movies_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_movies_counts"() RETURNS TABLE("movies_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT movieId) AS movies_count
  FROM
    shows
  WHERE
    date::date = CURRENT_DATE;
END;
$$;


ALTER FUNCTION "public"."get_movies_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_table"() RETURNS SETOF "public"."tickets"
    LANGUAGE "sql"
    AS $$  -- 4
  select * from tickets;
$$;


ALTER FUNCTION "public"."get_table"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_ticket_counts"("theatre_id" integer) RETURNS TABLE("date" "date", "ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS date,
    COUNT(*) AS ticket_count
  FROM
    tickets
  WHERE
    "theatreId" = theatre_id AND
    created_at >= NOW() - INTERVAL '7 days' AND
    created_at <= NOW()
  GROUP BY
    date_trunc('day', created_at)::date
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_ticket_counts"("theatre_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_ticket_counts_bydate"() RETURNS TABLE("ticket_count" bigint, "revenue" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS ticket_count,
    COALESCE(SUM(price), 0) AS revenue
  FROM
    tickets
  WHERE
    created_at::date = CURRENT_DATE;
END;
$$;


ALTER FUNCTION "public"."get_ticket_counts_bydate"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tickets_count_last_7_days"() RETURNS TABLE("created_at" "date", "ticket_count" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) AS created_at,
    COUNT(*) AS ticket_count
  FROM 
    tickets
  WHERE 
    created_at >= NOW() - INTERVAL '7 days'
  GROUP BY 
    DATE(created_at)
  ORDER BY 
    DATE(created_at);
END;
$$;


ALTER FUNCTION "public"."get_tickets_count_last_7_days"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weekly_bookings"() RETURNS TABLE("date" "date", "ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS date,
    COUNT(*) AS ticket_count
  FROM
    tickets
  WHERE
    created_at >= NOW() - INTERVAL '7 days' AND
    created_at <= NOW()
  GROUP BY
    date_trunc('day', created_at)::date
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_weekly_bookings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weekly_bookings"("theatre_id" integer) RETURNS TABLE("date" "date", "ticket_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS date,
    COUNT(*) AS ticket_count
  FROM
    tickets
  WHERE
    "theatreId" = theatre_id AND
    created_at >= NOW() - INTERVAL '7 days' AND
    created_at <= NOW()
  GROUP BY
    date_trunc('day', created_at)::date
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_weekly_bookings"("theatre_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weekly_revenue"() RETURNS TABLE("date" "date", "revenue" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS date,
    COALESCE(SUM(price), 0) AS revenue
  FROM
    tickets
  WHERE
    created_at >= NOW() - INTERVAL '7 days' AND
    created_at <= NOW()
  GROUP BY
    date_trunc('day', created_at)::date
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_weekly_revenue"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sold_event_tickets_count"("event_id" integer) RETURNS TABLE("count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS count
  FROM
    tickets_events
  WHERE
    "isActive" = true AND
    "eventId" = event_id;
END;
$$;


ALTER FUNCTION "public"."sold_event_tickets_count"("event_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sold_tickets_count_of_event"() RETURNS TABLE("event_id" integer, "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    "eventId"::INT AS event_id,
    COUNT(*)::BIGINT AS count
  FROM
    tickets_events
  WHERE
    "isActive" = true
  GROUP BY
    "eventId";
END;
$$;


ALTER FUNCTION "public"."sold_tickets_count_of_event"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sold_tickets_count_of_event"("event_id" integer) RETURNS TABLE("count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS count
  FROM
    tickets_events
  WHERE
    "isActive" = true AND
    "eventId" = event_id;
END;
$$;


ALTER FUNCTION "public"."sold_tickets_count_of_event"("event_id" integer) OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."allUsers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "mobile" numeric NOT NULL,
    "userRole" "text" NOT NULL,
    "theatreId" bigint,
    "isActive" boolean DEFAULT true NOT NULL,
    "eventOrganizationId" bigint
);


ALTER TABLE "public"."allUsers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cast" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "category" "text",
    "image" "text",
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."cast" OWNER TO "postgres";


COMMENT ON TABLE "public"."cast" IS 'cast  of films';



ALTER TABLE "public"."cast" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cast_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."censor_types" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "censor_type" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "icons" "text"
);


ALTER TABLE "public"."censor_types" OWNER TO "postgres";


COMMENT ON TABLE "public"."censor_types" IS 'censor types of films';



ALTER TABLE "public"."censor_types" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."censor_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."crew" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "category" "text",
    "image" "text",
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."crew" OWNER TO "postgres";


COMMENT ON TABLE "public"."crew" IS 'crew of films';



ALTER TABLE "public"."crew" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."crew_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."eventOrganizations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "telephone" "text",
    "organizationImage" "text",
    "coverImage" "text"
);


ALTER TABLE "public"."eventOrganizations" OWNER TO "postgres";


ALTER TABLE "public"."eventOrganizations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."eventOrganizations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."eventRegistrations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "eventId" bigint NOT NULL,
    "details" "text"
);


ALTER TABLE "public"."eventRegistrations" OWNER TO "postgres";


ALTER TABLE "public"."eventRegistrations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."eventRegistrations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."event_categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "categoryIcon" "text"
);


ALTER TABLE "public"."event_categories" OWNER TO "postgres";


ALTER TABLE "public"."event_categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."event_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."event_locations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "city" "text"
);


ALTER TABLE "public"."event_locations" OWNER TO "postgres";


ALTER TABLE "public"."event_locations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."event_locations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "description" "text",
    "date" timestamp without time zone,
    "startTime" time without time zone,
    "contactEmail" "text",
    "contactPhone" "text",
    "mainEventId" bigint,
    "isActive" boolean DEFAULT true,
    "eventOrganizationId" bigint,
    "venueId" bigint,
    "endDate" timestamp without time zone,
    "categoryId" bigint,
    "endTime" time without time zone,
    "isFree" boolean DEFAULT false NOT NULL,
    "eventImage" "text",
    "eventTrailer" "text",
    "eventTags" "jsonb"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


ALTER TABLE "public"."events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."facilities" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "facility_name" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "icons" "text"
);


ALTER TABLE "public"."facilities" OWNER TO "postgres";


COMMENT ON TABLE "public"."facilities" IS 'Facilities in theaters';



ALTER TABLE "public"."facilities" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."facilities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."genres" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "genre_name" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "icons" "text"
);


ALTER TABLE "public"."genres" OWNER TO "postgres";


COMMENT ON TABLE "public"."genres" IS 'movie genres';



ALTER TABLE "public"."genres" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."genres_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "language_name" "text",
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


COMMENT ON TABLE "public"."languages" IS 'languages of films';



ALTER TABLE "public"."languages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."languages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mainEvent" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "eventOrganizationId" bigint
);


ALTER TABLE "public"."mainEvent" OWNER TO "postgres";


ALTER TABLE "public"."mainEvent" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mainEvent_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_cast" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "cast_id" bigint
);


ALTER TABLE "public"."movie_cast" OWNER TO "postgres";


COMMENT ON TABLE "public"."movie_cast" IS 'cast members in movie';



ALTER TABLE "public"."movie_cast" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_cast_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_censor" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "censor_id" bigint
);


ALTER TABLE "public"."movie_censor" OWNER TO "postgres";


COMMENT ON TABLE "public"."movie_censor" IS 'censor types of movies';



ALTER TABLE "public"."movie_censor" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_censor_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_crew" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "crew_id" bigint
);


ALTER TABLE "public"."movie_crew" OWNER TO "postgres";


COMMENT ON TABLE "public"."movie_crew" IS 'crew of movies';



ALTER TABLE "public"."movie_crew" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_crew_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_genre" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "genre_id" bigint
);


ALTER TABLE "public"."movie_genre" OWNER TO "postgres";


COMMENT ON TABLE "public"."movie_genre" IS 'movies&genres';



ALTER TABLE "public"."movie_genre" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_genre_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_language" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "language_id" bigint
);


ALTER TABLE "public"."movie_language" OWNER TO "postgres";


COMMENT ON TABLE "public"."movie_language" IS 'languages and movies';



ALTER TABLE "public"."movie_language" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_language_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_projection" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "projection_id" bigint
);


ALTER TABLE "public"."movie_projection" OWNER TO "postgres";


COMMENT ON TABLE "public"."movie_projection" IS 'projection types of movie';



ALTER TABLE "public"."movie_projection" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_projection_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movie_sound" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "movie_id" bigint,
    "sound_id" bigint
);


ALTER TABLE "public"."movie_sound" OWNER TO "postgres";


ALTER TABLE "public"."movie_sound" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_sound_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movies" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "duration" "text",
    "release_date" "date",
    "cast" "text",
    "crew" "text",
    "genre" "text",
    "language" "text",
    "poster" "text",
    "synopsis" "text",
    "trailer_link" "text",
    "censor_type" "text",
    "projection_type" "text",
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."movies" OWNER TO "postgres";


COMMENT ON TABLE "public"."movies" IS 'Movies data';



ALTER TABLE "public"."movies" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" bigint NOT NULL,
    "name" "text",
    "description" "text"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


ALTER TABLE "public"."products" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."products_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."projection_types" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "projection_type" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "icons" "text"
);


ALTER TABLE "public"."projection_types" OWNER TO "postgres";


COMMENT ON TABLE "public"."projection_types" IS 'Projection Types';



ALTER TABLE "public"."projection_types" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."projection_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" integer NOT NULL,
    "question" "text" NOT NULL,
    "options" "text"[] NOT NULL,
    "correct_answer" "text" NOT NULL,
    "question_image" "text"
);


ALTER TABLE "public"."questions" OWNER TO "postgres";


COMMENT ON COLUMN "public"."questions"."question_image" IS 'images in questions';



CREATE SEQUENCE IF NOT EXISTS "public"."questions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."questions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."questions_id_seq" OWNED BY "public"."questions"."id";



CREATE TABLE IF NOT EXISTS "public"."registrationForm" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "type" "text",
    "options" "text",
    "eventId" bigint NOT NULL
);


ALTER TABLE "public"."registrationForm" OWNER TO "postgres";


ALTER TABLE "public"."registrationForm" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."registrationForm_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."screens" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "width" character varying,
    "height" character varying,
    "soundType" character varying,
    "projectionType" character varying,
    "facilities" character varying,
    "theatreId" bigint NOT NULL
);


ALTER TABLE "public"."screens" OWNER TO "postgres";


ALTER TABLE "public"."screens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."screen_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."seats" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "seatName" "text",
    "zoneId" bigint,
    "row" "text" NOT NULL,
    "column" "text" NOT NULL,
    "screenId" bigint NOT NULL
);


ALTER TABLE "public"."seats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."seats_events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "seatName" "text",
    "zoneId" bigint NOT NULL,
    "row" "text" NOT NULL,
    "column" "text" NOT NULL,
    "venueId" bigint NOT NULL
);


ALTER TABLE "public"."seats_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."seats_events" IS 'This is a duplicate of seats';



ALTER TABLE "public"."seats_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."seatsOfEvents_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."seats" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."seats_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."showTime" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "time" time without time zone NOT NULL,
    "screenId" bigint NOT NULL,
    "type" "text" NOT NULL
);


ALTER TABLE "public"."showTime" OWNER TO "postgres";


ALTER TABLE "public"."showTime" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."showTime_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."shows" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date" "date" NOT NULL,
    "screenId" bigint NOT NULL,
    "movieId" bigint NOT NULL,
    "theatreId" bigint NOT NULL,
    "showTimeId" bigint
);


ALTER TABLE "public"."shows" OWNER TO "postgres";


ALTER TABLE "public"."shows" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."shows_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."soundsystem_types" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "soundsystem_type" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "icons" "text"
);


ALTER TABLE "public"."soundsystem_types" OWNER TO "postgres";


COMMENT ON TABLE "public"."soundsystem_types" IS 'Types of Sound System';



ALTER TABLE "public"."soundsystem_types" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."soundsystem_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."stage_participants" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ticketId" bigint,
    "stageId" bigint NOT NULL,
    "checkedIn" boolean DEFAULT false NOT NULL,
    "eventId" bigint NOT NULL
);


ALTER TABLE "public"."stage_participants" OWNER TO "postgres";


ALTER TABLE "public"."stage_participants" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."stage_participants_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."stages" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "description" "text",
    "eventId" bigint,
    "qrImage" "text"
);


ALTER TABLE "public"."stages" OWNER TO "postgres";


ALTER TABLE "public"."stages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."stages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."allUsers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."theatreOwners_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."theatres" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "telephone" numeric NOT NULL,
    "ownerName" "text" NOT NULL,
    "ownerPhoneNumber" numeric NOT NULL,
    "ownerEmail" "text",
    "city" "text" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "websiteURL" "text",
    "licenseInfo" "text",
    "description" "text",
    "notes" "text",
    "facilities" "text",
    "coverImage" "text",
    "theatreImage" "text",
    "registeredDate" "date"
);


ALTER TABLE "public"."theatres" OWNER TO "postgres";


ALTER TABLE "public"."theatres" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."theatres_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."tickets_events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "seatId" bigint,
    "eventId" bigint,
    "eventOrganizationId" bigint NOT NULL,
    "bookedBy" "text",
    "totalPrice" "text",
    "referenceId" "text",
    "price" "text" NOT NULL,
    "zoneId" bigint,
    "venueId" bigint,
    "checkedIn" boolean DEFAULT false NOT NULL,
    "categoryId" bigint,
    "isActive" boolean DEFAULT true NOT NULL,
    "registrationId" bigint
);


ALTER TABLE "public"."tickets_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."tickets_events" IS 'This is a duplicate of tickets';



ALTER TABLE "public"."tickets_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tickets_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."tickets" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tickets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_responses" (
    "id" integer NOT NULL,
    "question_id" integer,
    "user_answer" "text" NOT NULL
);


ALTER TABLE "public"."user_responses" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_responses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."user_responses_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_responses_id_seq" OWNED BY "public"."user_responses"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "email" "text",
    "userRole" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'user data';



ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."venues" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "location" "text",
    "telephone" "text" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "ownerName" "text",
    "ownerMobile" "text",
    "ownerEmail" "text",
    "isSeat" boolean DEFAULT false NOT NULL,
    "locationId" bigint
);


ALTER TABLE "public"."venues" OWNER TO "postgres";


ALTER TABLE "public"."venues" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."venue_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."venue_locations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "city" "text"
);


ALTER TABLE "public"."venue_locations" OWNER TO "postgres";


ALTER TABLE "public"."venue_locations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."venue_locations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."zone_ticket_category" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "price" "text",
    "zoneId" bigint NOT NULL,
    "venueId" bigint NOT NULL,
    "ticketsCount" "text"
);


ALTER TABLE "public"."zone_ticket_category" OWNER TO "postgres";


ALTER TABLE "public"."zone_ticket_category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."zone_ticket_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."zones" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "price" "text",
    "screenId" bigint NOT NULL,
    "halfPrice" "text"
);


ALTER TABLE "public"."zones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zones_events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "price" "text",
    "venueId" bigint NOT NULL,
    "halfPrice" "text"
);


ALTER TABLE "public"."zones_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."zones_events" IS 'This is a duplicate of zones';



ALTER TABLE "public"."zones_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."zonesOfVenue_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."zones" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."zones_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."questions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."questions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_responses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_responses_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cast"
    ADD CONSTRAINT "cast_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."censor_types"
    ADD CONSTRAINT "censor_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crew"
    ADD CONSTRAINT "crew_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."eventOrganizations"
    ADD CONSTRAINT "eventOrganizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."eventRegistrations"
    ADD CONSTRAINT "eventRegistrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_categories"
    ADD CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."facilities"
    ADD CONSTRAINT "facilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mainEvent"
    ADD CONSTRAINT "mainEvent_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_cast"
    ADD CONSTRAINT "movie_cast_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_censor"
    ADD CONSTRAINT "movie_censor_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_crew"
    ADD CONSTRAINT "movie_crew_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_genre"
    ADD CONSTRAINT "movie_genre_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_language"
    ADD CONSTRAINT "movie_language_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_projection"
    ADD CONSTRAINT "movie_projection_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movie_sound"
    ADD CONSTRAINT "movie_sound_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."movies"
    ADD CONSTRAINT "movies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projection_types"
    ADD CONSTRAINT "projection_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."registrationForm"
    ADD CONSTRAINT "registrationForm_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."screens"
    ADD CONSTRAINT "screen_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seats_events"
    ADD CONSTRAINT "seatsOfEvents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seats"
    ADD CONSTRAINT "seats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."showTime"
    ADD CONSTRAINT "showTime_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shows"
    ADD CONSTRAINT "shows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."soundsystem_types"
    ADD CONSTRAINT "soundsystem_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stage_participants"
    ADD CONSTRAINT "stage_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stages"
    ADD CONSTRAINT "stages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."allUsers"
    ADD CONSTRAINT "theatreOwners_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."allUsers"
    ADD CONSTRAINT "theatreOwners_mobile_key" UNIQUE ("mobile");



ALTER TABLE ONLY "public"."allUsers"
    ADD CONSTRAINT "theatreOwners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."theatres"
    ADD CONSTRAINT "theatres_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_responses"
    ADD CONSTRAINT "user_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venue_locations"
    ADD CONSTRAINT "venue_locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zone_ticket_category"
    ADD CONSTRAINT "zone_ticket_category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zones_events"
    ADD CONSTRAINT "zonesOfVenue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zones"
    ADD CONSTRAINT "zones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."allUsers"
    ADD CONSTRAINT "allUsers_eventOrganizationId_fkey" FOREIGN KEY ("eventOrganizationId") REFERENCES "public"."eventOrganizations"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."eventRegistrations"
    ADD CONSTRAINT "eventRegistrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."event_categories"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_eventOrganizationId_fkey" FOREIGN KEY ("eventOrganizationId") REFERENCES "public"."eventOrganizations"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_mainEventId_fkey" FOREIGN KEY ("mainEventId") REFERENCES "public"."mainEvent"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id");



ALTER TABLE ONLY "public"."mainEvent"
    ADD CONSTRAINT "mainEvent_eventOrganizationId_fkey" FOREIGN KEY ("eventOrganizationId") REFERENCES "public"."eventOrganizations"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."movie_censor"
    ADD CONSTRAINT "movie_censor_censor_id_fkey" FOREIGN KEY ("censor_id") REFERENCES "public"."censor_types"("id");



ALTER TABLE ONLY "public"."movie_censor"
    ADD CONSTRAINT "movie_censor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_cast"
    ADD CONSTRAINT "public_movie_cast_cast_id_fkey" FOREIGN KEY ("cast_id") REFERENCES "public"."cast"("id");



ALTER TABLE ONLY "public"."movie_cast"
    ADD CONSTRAINT "public_movie_cast_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_crew"
    ADD CONSTRAINT "public_movie_crew_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "public"."crew"("id");



ALTER TABLE ONLY "public"."movie_crew"
    ADD CONSTRAINT "public_movie_crew_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_genre"
    ADD CONSTRAINT "public_movie_genre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id");



ALTER TABLE ONLY "public"."movie_genre"
    ADD CONSTRAINT "public_movie_genre_movie-id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_language"
    ADD CONSTRAINT "public_movie_language_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id");



ALTER TABLE ONLY "public"."movie_language"
    ADD CONSTRAINT "public_movie_language_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_projection"
    ADD CONSTRAINT "public_movie_projection_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_projection"
    ADD CONSTRAINT "public_movie_projection_projection_id_fkey" FOREIGN KEY ("projection_id") REFERENCES "public"."projection_types"("id");



ALTER TABLE ONLY "public"."movie_sound"
    ADD CONSTRAINT "public_movie_sound_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."movie_sound"
    ADD CONSTRAINT "public_movie_sound_sound_id_fkey" FOREIGN KEY ("sound_id") REFERENCES "public"."soundsystem_types"("id");



ALTER TABLE ONLY "public"."screens"
    ADD CONSTRAINT "public_screens_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "public"."theatres"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seats"
    ADD CONSTRAINT "public_seats_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."screens"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seats"
    ADD CONSTRAINT "public_seats_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."zones"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zones"
    ADD CONSTRAINT "public_zones_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."screens"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."registrationForm"
    ADD CONSTRAINT "registrationForm_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seats_events"
    ADD CONSTRAINT "seatsOfEvents_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seats_events"
    ADD CONSTRAINT "seatsOfEvents_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."zones_events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."showTime"
    ADD CONSTRAINT "showTime_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."screens"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shows"
    ADD CONSTRAINT "shows_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shows"
    ADD CONSTRAINT "shows_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."screens"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shows"
    ADD CONSTRAINT "shows_showTimeId_fkey" FOREIGN KEY ("showTimeId") REFERENCES "public"."showTime"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shows"
    ADD CONSTRAINT "shows_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "public"."theatres"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stage_participants"
    ADD CONSTRAINT "stage_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stage_participants"
    ADD CONSTRAINT "stage_participants_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."stages"("id");



ALTER TABLE ONLY "public"."stage_participants"
    ADD CONSTRAINT "stage_participants_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets_events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stages"
    ADD CONSTRAINT "stages_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."allUsers"
    ADD CONSTRAINT "theatreOwners_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "public"."theatres"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."zone_ticket_category"("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_eventOrganizationId_fkey" FOREIGN KEY ("eventOrganizationId") REFERENCES "public"."eventOrganizations"("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."eventRegistrations"("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "public"."seats_events"("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id");



ALTER TABLE ONLY "public"."tickets_events"
    ADD CONSTRAINT "tickets_events_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."zones_events"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."shows"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "public"."theatres"("id");



ALTER TABLE ONLY "public"."user_responses"
    ADD CONSTRAINT "user_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."venue_locations"("id");



ALTER TABLE ONLY "public"."zone_ticket_category"
    ADD CONSTRAINT "zone_ticket_category_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zone_ticket_category"
    ADD CONSTRAINT "zone_ticket_category_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."zones_events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zones_events"
    ADD CONSTRAINT "zonesOfVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Event Registration" ON "public"."eventRegistrations" USING (true);



CREATE POLICY "Events" ON "public"."events" USING (true);



CREATE POLICY "Main Event" ON "public"."mainEvent" USING (true);



CREATE POLICY "Owners" ON "public"."allUsers" USING (true);



CREATE POLICY "Registration Form" ON "public"."registrationForm" USING (true);



CREATE POLICY "Screens" ON "public"."screens" USING (true);



CREATE POLICY "Seats" ON "public"."seats" USING (true);



CREATE POLICY "Show Time" ON "public"."showTime" USING (true);



CREATE POLICY "Shows" ON "public"."shows" USING (true);



CREATE POLICY "Theatres" ON "public"."theatres" USING (true);



CREATE POLICY "Tickets" ON "public"."tickets" USING (true);



CREATE POLICY "Zones" ON "public"."zones" USING (true);



ALTER TABLE "public"."allUsers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cast" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cast" ON "public"."cast" USING (true);



ALTER TABLE "public"."censor_types" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "censor_types" ON "public"."censor_types" USING (true);



ALTER TABLE "public"."crew" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "crew" ON "public"."crew" USING (true);



ALTER TABLE "public"."eventOrganizations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "eventOrganizations" ON "public"."eventOrganizations" USING (true);



ALTER TABLE "public"."eventRegistrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_categories" ON "public"."event_categories" USING (true);



ALTER TABLE "public"."event_locations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_locations" ON "public"."event_locations" USING (true);



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."facilities" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "facilities" ON "public"."facilities" USING (true);



ALTER TABLE "public"."genres" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "genres" ON "public"."genres" USING (true);



ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "languages" ON "public"."languages" USING (true);



ALTER TABLE "public"."mainEvent" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie genre" ON "public"."movie_genre" USING (true);



ALTER TABLE "public"."movie_cast" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie_cast" ON "public"."movie_cast" USING (true);



ALTER TABLE "public"."movie_censor" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie_censor" ON "public"."movie_censor" USING (true);



ALTER TABLE "public"."movie_crew" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie_crew" ON "public"."movie_crew" USING (true);



ALTER TABLE "public"."movie_genre" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."movie_language" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie_language" ON "public"."movie_language" USING (true);



ALTER TABLE "public"."movie_projection" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie_projection" ON "public"."movie_projection" USING (true);



ALTER TABLE "public"."movie_sound" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movie_sound" ON "public"."movie_sound" USING (true);



ALTER TABLE "public"."movies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "movies" ON "public"."movies" USING (true);



CREATE POLICY "projection-types" ON "public"."projection_types" USING (true);



ALTER TABLE "public"."projection_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "questions" ON "public"."questions" TO "anon" USING (true);



ALTER TABLE "public"."registrationForm" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."screens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."seats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."seats_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "seats_events" ON "public"."seats_events" USING (true);



ALTER TABLE "public"."showTime" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shows" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sound" ON "public"."soundsystem_types" USING (true);



ALTER TABLE "public"."soundsystem_types" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "stage participants" ON "public"."stage_participants" USING (true);



ALTER TABLE "public"."stage_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "stages" ON "public"."stages" USING (true);



ALTER TABLE "public"."theatres" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ticket_category" ON "public"."zone_ticket_category" USING (true);



ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tickets_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tickets_events" ON "public"."tickets_events" USING (true);



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users" ON "public"."users" USING (true);



CREATE POLICY "venue" ON "public"."venues" USING (true);



ALTER TABLE "public"."venue_locations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "venue_locations" ON "public"."venue_locations" USING (true);



ALTER TABLE "public"."venues" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zone_ticket_category" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zones_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "zones_events" ON "public"."zones_events" USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
































































































































































































GRANT ALL ON FUNCTION "public"."events_count_by_categories"("category_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."events_count_by_categories"("category_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."events_count_by_categories"("category_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_active_movies_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_active_movies_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_active_movies_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_active_theatres_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_active_theatres_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_active_theatres_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_event_seats_count"("venue_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_event_seats_count"("venue_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_event_seats_count"("venue_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_seats_count"("screen_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_seats_count"("screen_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_seats_count"("screen_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_seats_counts"("screen_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_seats_counts"("screen_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_seats_counts"("screen_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_shows_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_shows_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_shows_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_theatres_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_theatres_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_theatres_count"() TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_tickets"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_tickets"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_tickets"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_booked_event_seats_count"("event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_booked_event_seats_count"("event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_booked_event_seats_count"("event_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_booked_seats_count"("show_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_booked_seats_count"("show_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_booked_seats_count"("show_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_booked_ticket_counts"("zone_id" integer, "event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_booked_ticket_counts"("zone_id" integer, "event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_booked_ticket_counts"("zone_id" integer, "event_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_booked_tickets_count"("event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_booked_tickets_count"("event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_booked_tickets_count"("event_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_booked_tickets_count"("zone_id" integer, "event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_booked_tickets_count"("zone_id" integer, "event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_booked_tickets_count"("zone_id" integer, "event_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_booked_tickets_count_test"("zone_id" integer, "event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_booked_tickets_count_test"("zone_id" integer, "event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_booked_tickets_count_test"("zone_id" integer, "event_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_event_ticket_count"("eventorganization_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_event_ticket_count"("eventorganization_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_event_ticket_count"("eventorganization_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_event_ticket_counts"("eventorganization_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_event_ticket_counts"("eventorganization_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_event_ticket_counts"("eventorganization_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_grouped_tickets"("theatre_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_grouped_tickets"("theatre_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_grouped_tickets"("theatre_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_last_five_theatres"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_last_five_theatres"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_last_five_theatres"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_last_ten_tickets"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_last_ten_tickets"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_last_ten_tickets"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_movies_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_movies_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_movies_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_movies_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_movies_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_movies_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_table"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_table"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_table"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_ticket_counts"("theatre_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_ticket_counts"("theatre_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_ticket_counts"("theatre_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_ticket_counts_bydate"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_ticket_counts_bydate"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_ticket_counts_bydate"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tickets_count_last_7_days"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_tickets_count_last_7_days"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_tickets_count_last_7_days"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weekly_bookings"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_weekly_bookings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weekly_bookings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weekly_bookings"("theatre_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_weekly_bookings"("theatre_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weekly_bookings"("theatre_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weekly_revenue"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_weekly_revenue"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weekly_revenue"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sold_event_tickets_count"("event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sold_event_tickets_count"("event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sold_event_tickets_count"("event_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."sold_tickets_count_of_event"() TO "anon";
GRANT ALL ON FUNCTION "public"."sold_tickets_count_of_event"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sold_tickets_count_of_event"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sold_tickets_count_of_event"("event_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sold_tickets_count_of_event"("event_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sold_tickets_count_of_event"("event_id" integer) TO "service_role";





















GRANT ALL ON TABLE "public"."allUsers" TO "anon";
GRANT ALL ON TABLE "public"."allUsers" TO "authenticated";
GRANT ALL ON TABLE "public"."allUsers" TO "service_role";



GRANT ALL ON TABLE "public"."cast" TO "anon";
GRANT ALL ON TABLE "public"."cast" TO "authenticated";
GRANT ALL ON TABLE "public"."cast" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cast_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cast_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cast_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."censor_types" TO "anon";
GRANT ALL ON TABLE "public"."censor_types" TO "authenticated";
GRANT ALL ON TABLE "public"."censor_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."censor_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."censor_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."censor_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."crew" TO "anon";
GRANT ALL ON TABLE "public"."crew" TO "authenticated";
GRANT ALL ON TABLE "public"."crew" TO "service_role";



GRANT ALL ON SEQUENCE "public"."crew_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."crew_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."crew_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."eventOrganizations" TO "anon";
GRANT ALL ON TABLE "public"."eventOrganizations" TO "authenticated";
GRANT ALL ON TABLE "public"."eventOrganizations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."eventOrganizations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."eventOrganizations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."eventOrganizations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."eventRegistrations" TO "anon";
GRANT ALL ON TABLE "public"."eventRegistrations" TO "authenticated";
GRANT ALL ON TABLE "public"."eventRegistrations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."eventRegistrations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."eventRegistrations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."eventRegistrations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."event_categories" TO "anon";
GRANT ALL ON TABLE "public"."event_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."event_categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."event_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."event_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."event_categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."event_locations" TO "anon";
GRANT ALL ON TABLE "public"."event_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."event_locations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."event_locations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."event_locations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."event_locations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."facilities" TO "anon";
GRANT ALL ON TABLE "public"."facilities" TO "authenticated";
GRANT ALL ON TABLE "public"."facilities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."facilities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."facilities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."facilities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."genres" TO "anon";
GRANT ALL ON TABLE "public"."genres" TO "authenticated";
GRANT ALL ON TABLE "public"."genres" TO "service_role";



GRANT ALL ON SEQUENCE "public"."genres_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."genres_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."genres_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mainEvent" TO "anon";
GRANT ALL ON TABLE "public"."mainEvent" TO "authenticated";
GRANT ALL ON TABLE "public"."mainEvent" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mainEvent_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mainEvent_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mainEvent_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_cast" TO "anon";
GRANT ALL ON TABLE "public"."movie_cast" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_cast" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_cast_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_cast_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_cast_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_censor" TO "anon";
GRANT ALL ON TABLE "public"."movie_censor" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_censor" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_censor_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_censor_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_censor_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_crew" TO "anon";
GRANT ALL ON TABLE "public"."movie_crew" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_crew" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_crew_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_crew_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_crew_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_genre" TO "anon";
GRANT ALL ON TABLE "public"."movie_genre" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_genre" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_genre_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_genre_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_genre_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_language" TO "anon";
GRANT ALL ON TABLE "public"."movie_language" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_language" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_language_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_language_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_language_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_projection" TO "anon";
GRANT ALL ON TABLE "public"."movie_projection" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_projection" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_projection_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_projection_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_projection_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movie_sound" TO "anon";
GRANT ALL ON TABLE "public"."movie_sound" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_sound" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movie_sound_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_sound_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_sound_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movies" TO "anon";
GRANT ALL ON TABLE "public"."movies" TO "authenticated";
GRANT ALL ON TABLE "public"."movies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movies_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."projection_types" TO "anon";
GRANT ALL ON TABLE "public"."projection_types" TO "authenticated";
GRANT ALL ON TABLE "public"."projection_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."projection_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."projection_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."projection_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."registrationForm" TO "anon";
GRANT ALL ON TABLE "public"."registrationForm" TO "authenticated";
GRANT ALL ON TABLE "public"."registrationForm" TO "service_role";



GRANT ALL ON SEQUENCE "public"."registrationForm_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."registrationForm_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."registrationForm_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."screens" TO "anon";
GRANT ALL ON TABLE "public"."screens" TO "authenticated";
GRANT ALL ON TABLE "public"."screens" TO "service_role";



GRANT ALL ON SEQUENCE "public"."screen_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."screen_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."screen_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."seats" TO "anon";
GRANT ALL ON TABLE "public"."seats" TO "authenticated";
GRANT ALL ON TABLE "public"."seats" TO "service_role";



GRANT ALL ON TABLE "public"."seats_events" TO "anon";
GRANT ALL ON TABLE "public"."seats_events" TO "authenticated";
GRANT ALL ON TABLE "public"."seats_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."seatsOfEvents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."seatsOfEvents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."seatsOfEvents_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."seats_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."seats_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."seats_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."showTime" TO "anon";
GRANT ALL ON TABLE "public"."showTime" TO "authenticated";
GRANT ALL ON TABLE "public"."showTime" TO "service_role";



GRANT ALL ON SEQUENCE "public"."showTime_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."showTime_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."showTime_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shows" TO "anon";
GRANT ALL ON TABLE "public"."shows" TO "authenticated";
GRANT ALL ON TABLE "public"."shows" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shows_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shows_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shows_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."soundsystem_types" TO "anon";
GRANT ALL ON TABLE "public"."soundsystem_types" TO "authenticated";
GRANT ALL ON TABLE "public"."soundsystem_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."soundsystem_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."soundsystem_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."soundsystem_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stage_participants" TO "anon";
GRANT ALL ON TABLE "public"."stage_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."stage_participants" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stage_participants_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stage_participants_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stage_participants_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stages" TO "anon";
GRANT ALL ON TABLE "public"."stages" TO "authenticated";
GRANT ALL ON TABLE "public"."stages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stages_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."theatreOwners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."theatreOwners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."theatreOwners_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."theatres" TO "anon";
GRANT ALL ON TABLE "public"."theatres" TO "authenticated";
GRANT ALL ON TABLE "public"."theatres" TO "service_role";



GRANT ALL ON SEQUENCE "public"."theatres_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."theatres_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."theatres_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tickets_events" TO "anon";
GRANT ALL ON TABLE "public"."tickets_events" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tickets_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tickets_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tickets_events_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_responses" TO "anon";
GRANT ALL ON TABLE "public"."user_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."user_responses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_responses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_responses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_responses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."venues" TO "anon";
GRANT ALL ON TABLE "public"."venues" TO "authenticated";
GRANT ALL ON TABLE "public"."venues" TO "service_role";



GRANT ALL ON SEQUENCE "public"."venue_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."venue_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."venue_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."venue_locations" TO "anon";
GRANT ALL ON TABLE "public"."venue_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."venue_locations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."venue_locations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."venue_locations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."venue_locations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."zone_ticket_category" TO "anon";
GRANT ALL ON TABLE "public"."zone_ticket_category" TO "authenticated";
GRANT ALL ON TABLE "public"."zone_ticket_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."zone_ticket_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."zone_ticket_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."zone_ticket_category_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."zones" TO "anon";
GRANT ALL ON TABLE "public"."zones" TO "authenticated";
GRANT ALL ON TABLE "public"."zones" TO "service_role";



GRANT ALL ON TABLE "public"."zones_events" TO "anon";
GRANT ALL ON TABLE "public"."zones_events" TO "authenticated";
GRANT ALL ON TABLE "public"."zones_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."zonesOfVenue_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."zonesOfVenue_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."zonesOfVenue_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."zones_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."zones_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."zones_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
