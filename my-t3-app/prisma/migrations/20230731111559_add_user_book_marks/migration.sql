BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserBookMark] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [name] TEXT NOT NULL,
    [url] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserBookMark_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [UserBookMark_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserBookMark] ADD CONSTRAINT [UserBookMark_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
