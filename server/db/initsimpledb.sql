--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."APARPTF_A" (
		"APARID" VARCHAR(10 OCTETS) NOT NULL,
		"PTFID" VARCHAR(10 OCTETS) NOT NULL
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."APARPTF_A" TO USER "DB2INST1" WITH GRANT OPTION;


--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."APARS_A" (
		"APARID" VARCHAR(10 OCTETS) NOT NULL,
		"HIPER" INTEGER NOT NULL,
		"CLOSEDATE" DATE,
		"SEVERITY" INTEGER NOT NULL,
		"SUMMARY" VARCHAR(129 OCTETS)
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."APARS_A" TO USER "DB2INST1" WITH GRANT OPTION;

--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."MEPLITEMS_A" (
		"MEPLID" INTEGER NOT NULL,
		"LDMOD" VARCHAR(10 OCTETS) NOT NULL,
		"MODULE" VARCHAR(10 OCTETS) NOT NULL,
		"PTFID" VARCHAR(10 OCTETS),
		"UNOFFPTF" VARCHAR(10 OCTETS)
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."MEPLITEMS_A" TO USER "DB2INST1" WITH GRANT OPTION;

--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."MEPLS_A" (
		"MEPLID" INTEGER NOT NULL,
		"PRODID" INTEGER NOT NULL,
		"USERID" VARCHAR(20 OCTETS) NOT NULL,
		"SUBSYS" VARCHAR(4 OCTETS) NOT NULL,
		"RELEASE" VARCHAR(10 OCTETS) NOT NULL,
		"SUBRELEASE" INTEGER NOT NULL,
		"DATE" DATE NOT NULL,
		"COMMENT" VARCHAR(60 OCTETS)
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."MEPLS_A" TO USER "DB2INST1" WITH GRANT OPTION;

--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."PERFORMANCEANALYSIS_A" (
		"ANALYSISID" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( START WITH 1000 INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 NO CYCLE CACHE 20 NO ORDER ),
		"USERID" VARCHAR(50 OCTETS) NOT NULL,
		"USERTIME" VARCHAR(50 OCTETS),
		"USERAREA" VARCHAR(50 OCTETS),
		"USERFUNCTION" VARCHAR(50 OCTETS) NOT NULL,
		"LOCALTIME" VARCHAR(50 OCTETS) NOT NULL
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;


--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."PE_A" (
		"PTFID" VARCHAR(10 OCTETS) NOT NULL,
		"APARID" VARCHAR(10 OCTETS) NOT NULL
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."PE_A" TO USER "DB2INST1" WITH GRANT OPTION;

--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."PTFS_A" (
		"PTFID" VARCHAR(10 OCTETS) NOT NULL,
		"RELEASE" VARCHAR(10 OCTETS) NOT NULL,
		"SUBRELEASE" INTEGER NOT NULL
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."PTFS_A" TO USER "DB2INST1" WITH GRANT OPTION;

--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."RELATIONS_A" (
		"MODULE" VARCHAR(12 OCTETS) NOT NULL,
		"APARID" VARCHAR(10 OCTETS) NOT NULL,
		"PREVAPAR" VARCHAR(10 OCTETS),
		"PTFID" VARCHAR(10 OCTETS),
		"TYPE" INTEGER NOT NULL,
		"RANK" INTEGER NOT NULL,
		"RELEASE" VARCHAR(10 OCTETS) NOT NULL,
		"SUBRELEASE" INTEGER NOT NULL
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."RELATIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."REPORTCOMMENTS_A" (
		"MEPLID" VARCHAR(10 OCTETS) NOT NULL,
		"COMMENTID" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( START WITH 1000 INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 NO CYCLE CACHE 20 NO ORDER ),
		"COMMENT" VARCHAR(1000 OCTETS) NOT NULL,
		"ISDELETED" INTEGER NOT NULL DEFAULT 1
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;


--<ScriptOptions statementTerminator=";"/>

CREATE TABLE "BLUADMIN"."VERSIONS_A" (
		"PRODID" INTEGER NOT NULL,
		"RELEASE" VARCHAR(1 OCTETS) NOT NULL,
		"SUBRELEASE" INTEGER NOT NULL
	)
	ORGANIZE BY ROW
	DATA CAPTURE NONE
	IN "USERSPACE1"
	COMPRESS NO;

GRANT ALTER ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT CONTROL ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1";

GRANT DELETE ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INDEX ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT INSERT ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT SELECT ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;

GRANT UPDATE ON TABLE "BLUADMIN"."VERSIONS_A" TO USER "DB2INST1" WITH GRANT OPTION;


