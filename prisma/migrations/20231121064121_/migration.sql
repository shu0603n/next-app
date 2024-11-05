-- CreateTable
CREATE TABLE "attendance" (
    "employee_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "location" TEXT,
    "approve" BOOLEAN DEFAULT false,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("employee_id","date")
);

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_k" VARCHAR(255),
    "address" VARCHAR(255),
    "phone" VARCHAR(255),
    "email" VARCHAR(255),
    "postal_code" VARCHAR(255),
    "remarks" VARCHAR(255),

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "sei" VARCHAR(255) NOT NULL,
    "mei" VARCHAR(255) NOT NULL,
    "sei_k" VARCHAR(255),
    "mei_k" VARCHAR(255),
    "gender" VARCHAR(255),
    "birthday" DATE,
    "job_category_id" INTEGER,
    "client_id" INTEGER,
    "project_id" INTEGER,
    "address" VARCHAR(255),
    "joining_date" DATE,
    "retirement_date" DATE,
    "phone_number" VARCHAR(255),
    "email" VARCHAR(255),
    "postal_code" VARCHAR(8),
    "remarks" VARCHAR(255),
    "position_id" INTEGER,
    "employment_id" INTEGER,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_skills" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "project_title" VARCHAR(255),
    "description" VARCHAR(2000),
    "people_number" INTEGER,
    "client_id" INTEGER,

    CONSTRAINT "employee_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "invoice_date" DATE,
    "contract_price" INTEGER NOT NULL,
    "invoice_amount" INTEGER NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "employee_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "working_hours" DOUBLE PRECISION,
    "payment_flg" BOOLEAN DEFAULT false,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "job_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_project_processes" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER,
    "process_id" INTEGER,

    CONSTRAINT "employee_project_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "hp_posting_flag" BOOLEAN NOT NULL DEFAULT false,
    "client_id" INTEGER,
    "contract_id" INTEGER,
    "working_postal_code" VARCHAR(255),
    "working_address" VARCHAR(255),
    "holiday" VARCHAR(255),
    "project_title" VARCHAR(255),
    "description" VARCHAR(255),
    "working_start_time" VARCHAR(10),
    "working_end_time" VARCHAR(10),
    "start_date" DATE,
    "end_date" DATE,
    "price" VARCHAR(40),

    CONSTRAINT "example_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_process" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER,
    "process_id" INTEGER,

    CONSTRAINT "project_process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_skills" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER,
    "skill_id" INTEGER,

    CONSTRAINT "project_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "project_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "technic_id" INTEGER,
    "candidate_flag" BOOLEAN DEFAULT false,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_project_skills" (
    "id" SERIAL NOT NULL,
    "employee_skills_id" INTEGER,
    "skill_id" INTEGER,

    CONSTRAINT "employee_project_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technic" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "technic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "working_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "your_table_name" (
    "id" SERIAL NOT NULL,
    "invoice_date" DATE,
    "contract_price" DECIMAL NOT NULL,
    "invoice_amount" DECIMAL NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "employee_id" DECIMAL NOT NULL,
    "client_id" DECIMAL NOT NULL,
    "project_id" DECIMAL NOT NULL,
    "working_hours" DOUBLE PRECISION,
    "payment_flg" BOOLEAN DEFAULT false,

    CONSTRAINT "your_table_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_employment_id_fkey" FOREIGN KEY ("employment_id") REFERENCES "employment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_job_category_id_fkey" FOREIGN KEY ("job_category_id") REFERENCES "job_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_project_processes" ADD CONSTRAINT "employee_project_processes_employee_skills_id_fkey" FOREIGN KEY ("project_id") REFERENCES "employee_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_project_processes" ADD CONSTRAINT "employee_project_processes_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "example_table_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "example_table_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_process" ADD CONSTRAINT "project_process_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_process" ADD CONSTRAINT "project_process_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_technic_id_fkey" FOREIGN KEY ("technic_id") REFERENCES "technic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_project_skills" ADD CONSTRAINT "employee_project_skills_employee_skills_id_fkey" FOREIGN KEY ("employee_skills_id") REFERENCES "employee_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_project_skills" ADD CONSTRAINT "employee_project_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
