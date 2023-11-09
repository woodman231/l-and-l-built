import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createOneInputValidator } from "~/features/userBookMarks/validators/createOneInputValidator";
import { getOneInputValidator } from "~/features/userBookMarks/validators/getOneInputValidator";
import { updateOneInputValidator } from "~/features/userBookMarks/validators/updateOneInputValidator";
import { userBookMarkDetailsOutputValidator } from "~/features/userBookMarks/validators/userBookMarkDetailsOutputValidator";
import { listOfUserBookMarksDetailsOutputValidator } from "~/features/userBookMarks/validators/listOfUserBookMarksDetailsOutputValidator";
import { UserBookMarkDataTransferService } from "../dataTransferServices/userBookMarksDataTransferService";

export const userBookMarksRouter = createTRPCRouter({
    createOne: protectedProcedure.input(createOneInputValidator).output(userBookMarkDetailsOutputValidator).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.session.user;
        const { name, url } = input;

        try {
            const service = ctx.getUserBookMarksService();

            const dto = await service.createOne({
                user: ctx.session.user,
                data: {
                    userId,
                    name,
                    url
                }
            });

            const outputModel = UserBookMarkDataTransferService.userBookMarkDTOtoRouterOutputModel(dto);

            return outputModel;

        }
        catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            });
        }

    }),

    getOne: protectedProcedure.input(getOneInputValidator).output(userBookMarkDetailsOutputValidator).query(async ({ ctx, input }) => {
        const { id } = input;

        try {
            const service = ctx.getUserBookMarksService();

            const dto = await service.getOneById({
                user: ctx.session.user,
                data: {
                    id
                }
            });

            const outputModel = UserBookMarkDataTransferService.userBookMarkDTOtoRouterOutputModel(dto);

            return outputModel;

        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2001":
                    case "P2025":
                        throw new TRPCError({
                            code: "NOT_FOUND"
                        })
                }
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            });
        }

    }),

    updateOne: protectedProcedure.input(updateOneInputValidator).output(userBookMarkDetailsOutputValidator).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.session.user;
        const { id: requestedBookMarkId, name: newName, url: newUrl } = input;

        try {
            const service = ctx.getUserBookMarksService();

            const dto = await service.updateOne({
                user: ctx.session.user,
                data: {
                    id: requestedBookMarkId,
                    userId: userId,
                    name: newName,
                    url: newUrl
                }
            });

            const outputModel = UserBookMarkDataTransferService.userBookMarkDTOtoRouterOutputModel(dto);

            return outputModel;

        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2001":
                    case "P2025":
                        throw new TRPCError({
                            code: "NOT_FOUND"
                        })
                }
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }),

    getList: protectedProcedure.output(listOfUserBookMarksDetailsOutputValidator).query(async ({ ctx }) => {

        try {
            const service = ctx.getUserBookMarksService();

            const dtos = await service.getAllByUserId({
                user: ctx.session.user
            });

            const outputModels = dtos.map((dto) => {
                return UserBookMarkDataTransferService.userBookMarkDTOtoRouterOutputModel(dto);
            })

            return outputModels;

        }
        catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }),

    deleteOne: protectedProcedure.input(getOneInputValidator).mutation(async ({ ctx, input }) => {
        const { id } = input;

        try {
            const service = ctx.getUserBookMarksService();

            await service.deleteOne({
                user: ctx.session.user,
                data: {
                    id
                }
            })
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2001":
                    case "P2025":
                        throw new TRPCError({
                            code: "NOT_FOUND"
                        })
                }
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    })

});