/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatParticipant";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventParticipant";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Utente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "dataIscrizione" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipologiaAbbonamento" TEXT NOT NULL,
    "tipologiaUtente" TEXT NOT NULL,

    CONSTRAINT "Utente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prenotazione" (
    "idPrenotazione" SERIAL NOT NULL,
    "dataInizio" TIMESTAMP(3) NOT NULL,
    "dataFine" TIMESTAMP(3) NOT NULL,
    "linguaInsegnamento" TEXT NOT NULL,
    "nazione" TEXT NOT NULL,
    "citta" TEXT NOT NULL,
    "indirizzo" TEXT NOT NULL,
    "numeroOspiti" INTEGER NOT NULL,
    "numeroAnimali" INTEGER NOT NULL,
    "animali" TEXT NOT NULL,
    "rimborso" BOOLEAN NOT NULL,
    "vittoAlloggio" BOOLEAN NOT NULL,
    "statoPrenotazione" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Prenotazione_pkey" PRIMARY KEY ("idPrenotazione")
);

-- CreateTable
CREATE TABLE "Conversazione" (
    "idConversazione" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "partnerId" INTEGER NOT NULL,

    CONSTRAINT "Conversazione_pkey" PRIMARY KEY ("idConversazione")
);

-- CreateTable
CREATE TABLE "Messaggio" (
    "idMessaggio" SERIAL NOT NULL,
    "conversazioneId" INTEGER NOT NULL,
    "utenteId" INTEGER NOT NULL,
    "messaggio" TEXT NOT NULL,
    "dataInvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messaggio_pkey" PRIMARY KEY ("idMessaggio")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");

-- AddForeignKey
ALTER TABLE "Prenotazione" ADD CONSTRAINT "Prenotazione_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazione" ADD CONSTRAINT "Prenotazione_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversazione" ADD CONSTRAINT "Conversazione_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversazione" ADD CONSTRAINT "Conversazione_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messaggio" ADD CONSTRAINT "Messaggio_conversazioneId_fkey" FOREIGN KEY ("conversazioneId") REFERENCES "Conversazione"("idConversazione") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messaggio" ADD CONSTRAINT "Messaggio_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
