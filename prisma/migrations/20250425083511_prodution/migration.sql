-- CreateEnum
CREATE TYPE "Tipo_entidades" AS ENUM ('farmacia', 'deposito');

-- CreateEnum
CREATE TYPE "StatusAquisicao" AS ENUM ('pendente', 'concluido', 'cancelado');

-- CreateEnum
CREATE TYPE "Tipo_aquisicao" AS ENUM ('emediata');

-- CreateEnum
CREATE TYPE "Tipo_acesso" AS ENUM ('admin');

-- CreateTable
CREATE TABLE "tbl_contas" (
    "id_conta" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_contas_pkey" PRIMARY KEY ("id_conta")
);

-- CreateTable
CREATE TABLE "tbl_admin" (
    "id_admin" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nivel_acesso" "Tipo_acesso" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_conta_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "tbl_entidades" (
    "id_entidade" TEXT NOT NULL,
    "NIF_entidade" TEXT NOT NULL,
    "firma_entidade" TEXT NOT NULL,
    "tipo_entidade" "Tipo_entidades" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_conta_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_entidades_pkey" PRIMARY KEY ("id_entidade")
);

-- CreateTable
CREATE TABLE "tbl_geolocalizacao" (
    "id_geolocalizacao" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "id_entidade_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_geolocalizacao_pkey" PRIMARY KEY ("id_geolocalizacao")
);

-- CreateTable
CREATE TABLE "tbl_contactos" (
    "id_contacto" TEXT NOT NULL,
    "contacto" INTEGER NOT NULL,
    "id_entidade_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_contactos_pkey" PRIMARY KEY ("id_contacto")
);

-- CreateTable
CREATE TABLE "tbl_enderecos" (
    "id_endereco" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "cidade" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Angola',
    "id_entidade_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_enderecos_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "tbl_categoria_medicamentos" (
    "id_categoria_medicamento" TEXT NOT NULL,
    "nome_categoria_medicamento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_categoria_medicamentos_pkey" PRIMARY KEY ("id_categoria_medicamento")
);

-- CreateTable
CREATE TABLE "tbl_medicamentos" (
    "id_medicamento" TEXT NOT NULL,
    "nome_generico_medicamento" TEXT NOT NULL,
    "nome_comercial_medicamento" TEXT NOT NULL,
    "origem_medicamento" TEXT NOT NULL,
    "preco_medicamento" DOUBLE PRECISION NOT NULL,
    "validade_medicamento" TIMESTAMP(3) NOT NULL,
    "imagem_url" TEXT NOT NULL,
    "quantidade_disponivel_medicamento" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "id_entidade_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_medicamentos_pkey" PRIMARY KEY ("id_medicamento")
);

-- CreateTable
CREATE TABLE "tbl_aquisicao" (
    "id_aquisicao" TEXT NOT NULL,
    "quantidade_aquisicao" INTEGER NOT NULL,
    "data_aquisicao" TIMESTAMP(3) NOT NULL,
    "tipo_aquisicao" "Tipo_aquisicao" NOT NULL,
    "total_compra" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "id_entidade_fk" TEXT NOT NULL,
    "status" "StatusAquisicao",

    CONSTRAINT "tbl_aquisicao_pkey" PRIMARY KEY ("id_aquisicao")
);

-- CreateTable
CREATE TABLE "tbl_aquisicao_medicamentos" (
    "id_aquisicao_medicamento" TEXT NOT NULL,
    "id_medicamento" TEXT NOT NULL,
    "id_aquisicao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_aquisicao_medicamentos_pkey" PRIMARY KEY ("id_aquisicao_medicamento")
);

-- CreateTable
CREATE TABLE "tbl_recuperacao_senha" (
    "id_recuperacao_senha" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiracao" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL,
    "id_conta_fk" TEXT,

    CONSTRAINT "tbl_recuperacao_senha_pkey" PRIMARY KEY ("id_recuperacao_senha")
);

-- CreateTable
CREATE TABLE "tbl_refreshTokens" (
    "id_refreshToken" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiracao" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN,
    "id_conta_fk" TEXT NOT NULL,

    CONSTRAINT "tbl_refreshTokens_pkey" PRIMARY KEY ("id_refreshToken")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_contas_email_key" ON "tbl_contas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_entidades_NIF_entidade_key" ON "tbl_entidades"("NIF_entidade");

-- CreateIndex
CREATE INDEX "tbl_geolocalizacao_id_entidade_fkey" ON "tbl_geolocalizacao"("id_entidade_fk");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_contactos_contacto_key" ON "tbl_contactos"("contacto");

-- CreateIndex
CREATE INDEX "tbl_contactos_id_entidade_fkey" ON "tbl_contactos"("id_entidade_fk");

-- CreateIndex
CREATE INDEX "tbl_enderecos_id_entidade_fkey" ON "tbl_enderecos"("id_entidade_fk");

-- CreateIndex
CREATE INDEX "tbl_aquisicao_id_entidade_fkey" ON "tbl_aquisicao"("id_entidade_fk");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_recuperacao_senha_token_key" ON "tbl_recuperacao_senha"("token");

-- AddForeignKey
ALTER TABLE "tbl_admin" ADD CONSTRAINT "tbl_admin_id_conta_fk_fkey" FOREIGN KEY ("id_conta_fk") REFERENCES "tbl_contas"("id_conta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_entidades" ADD CONSTRAINT "tbl_entidades_id_conta_fk_fkey" FOREIGN KEY ("id_conta_fk") REFERENCES "tbl_contas"("id_conta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_geolocalizacao" ADD CONSTRAINT "tbl_geolocalizacao_id_entidade_fk_fkey" FOREIGN KEY ("id_entidade_fk") REFERENCES "tbl_entidades"("id_entidade") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_contactos" ADD CONSTRAINT "tbl_contactos_id_entidade_fk_fkey" FOREIGN KEY ("id_entidade_fk") REFERENCES "tbl_entidades"("id_entidade") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_enderecos" ADD CONSTRAINT "tbl_enderecos_id_entidade_fk_fkey" FOREIGN KEY ("id_entidade_fk") REFERENCES "tbl_entidades"("id_entidade") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_medicamentos" ADD CONSTRAINT "tbl_medicamentos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "tbl_categoria_medicamentos"("id_categoria_medicamento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_medicamentos" ADD CONSTRAINT "tbl_medicamentos_id_entidade_fk_fkey" FOREIGN KEY ("id_entidade_fk") REFERENCES "tbl_entidades"("id_entidade") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_aquisicao" ADD CONSTRAINT "tbl_aquisicao_id_entidade_fk_fkey" FOREIGN KEY ("id_entidade_fk") REFERENCES "tbl_entidades"("id_entidade") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_aquisicao_medicamentos" ADD CONSTRAINT "tbl_aquisicao_medicamentos_id_aquisicao_fkey" FOREIGN KEY ("id_aquisicao") REFERENCES "tbl_aquisicao"("id_aquisicao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_aquisicao_medicamentos" ADD CONSTRAINT "tbl_aquisicao_medicamentos_id_medicamento_fkey" FOREIGN KEY ("id_medicamento") REFERENCES "tbl_medicamentos"("id_medicamento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_recuperacao_senha" ADD CONSTRAINT "tbl_recuperacao_senha_id_conta_fk_fkey" FOREIGN KEY ("id_conta_fk") REFERENCES "tbl_contas"("id_conta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_refreshTokens" ADD CONSTRAINT "tbl_refreshTokens_id_conta_fk_fkey" FOREIGN KEY ("id_conta_fk") REFERENCES "tbl_contas"("id_conta") ON DELETE CASCADE ON UPDATE CASCADE;
