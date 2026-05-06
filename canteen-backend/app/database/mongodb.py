from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    database: AsyncIOMotorDatabase | None = None


mongodb = MongoDB()


async def connect_to_mongo() -> None:
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URI)
    mongodb.database = mongodb.client[settings.MONGODB_DB_NAME]
    await mongodb.database.users.create_index("email", unique=True)
    await mongodb.database.menu_items.create_index("name")
    await mongodb.database.orders.create_index("user_id")
    await mongodb.database.combos.create_index("name")
    await mongodb.database.offers.create_index("valid_till")


async def close_mongo_connection() -> None:
    if mongodb.client is not None:
        mongodb.client.close()


def get_database() -> AsyncIOMotorDatabase:
    if mongodb.database is None:
        raise RuntimeError("MongoDB is not connected")
    return mongodb.database
