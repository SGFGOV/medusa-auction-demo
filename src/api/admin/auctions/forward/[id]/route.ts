/* eslint-disable require-jsdoc */
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import AuctionService from "../../../../../services/auction";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const id = req.params.id;

    const auctionService = req.scope.resolve(
        "auctionService"
    ) as AuctionService;

    const auctions = await auctionService.retrieve(id, {
        relations: ["bids"]
    });

    res.status(200).json({ auctions });
    return;
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const id = req.params.id;

    const auctionService = req.scope.resolve(
        "auctionService"
    ) as AuctionService;

    const userAuction = await auctionService.retrieve(id);

    const userId = req.user.userId;

    if (userAuction.created_by == userId) {
        const auction = await auctionService.update(id, req.body);

        res.status(200).json({ auction });
        return;
    }
    res.sendStatus(401);
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const id = req.params.id;

    const auctionService = req.scope.resolve(
        "auctionService"
    ) as AuctionService;
    const userAuction = await auctionService.retrieve(id);

    const userId = req.user.userId;

    if (userAuction.created_by == userId) {
        await auctionService.delete(id);

        res.status(200).json({});
        return;
    }
    res.sendStatus(401);
}
