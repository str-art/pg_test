--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

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

--
-- Name: uuid; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.uuid
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.uuid OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: File; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."File" (
    id integer DEFAULT nextval('public.uuid'::regclass) NOT NULL,
    name character varying(250),
    extension character varying(10),
    path character varying(250),
    ref integer
);


ALTER TABLE public."File" OWNER TO root;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Product" (
    id integer DEFAULT nextval('public.uuid'::regclass) NOT NULL,
    name character varying(250),
    price integer,
    quantity integer DEFAULT 0
);


ALTER TABLE public."Product" OWNER TO root;

--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

