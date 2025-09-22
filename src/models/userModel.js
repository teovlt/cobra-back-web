import { DynamoDBClient, PutItemCommand, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import db from "../database/db.js";

const tableName = "users-cobra";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function createUser(username, password) {
  const id = crypto.randomUUID();
  const passwordHash = hashPassword(password);

  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      id: { S: id },
      username: { S: username },
      passwordHash: { S: passwordHash },
      createdAt: { S: new Date().toISOString() },
    },
    ConditionExpression: "attribute_not_exists(username)",
  });

  await db.send(command);
  return { id, username };
}

export async function getUser(id) {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: id } },
  });

  const response = await db.send(command);
  return response.Item || null;
}

export async function getAllUsers() {
  const scanCommand = new ScanCommand({
    TableName: tableName,
  });

  const response = await db.send(scanCommand);
  return response.Items || [];
}
