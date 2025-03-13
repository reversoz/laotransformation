import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.NEXT_PUBLIC_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_SECRET,
  },
});

async function updateMetadata(tokenId) {
  try {
    // Step 1: Get JSON from R2
    const getCommand = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
      Key: tokenId.toString(),
    });

    const response = await s3Client.send(getCommand);
    const streamToString = await response.Body.transformToString();
    const data = JSON.parse(streamToString);

    // Step 2: Update the metadata
    // Update Transformed attribute
    let transformedAttrExists = false;
    for (const attr of data.attributes) {
      if (attr.trait_type === "Transformed") {
        attr.value = "Yes";
        transformedAttrExists = true;
        break;
      }
    }

    // Add Transformed attribute if it doesn't exist
    if (!transformedAttrExists) {
      data.attributes.push({
        trait_type: "Transformed",
        value: "Yes",
      });
    }

    // Update image URL
    const baseUri = data.image.split("/").slice(0, -1).join("/");
    data.image = `${baseUri}/${tokenId}_museum.png`;

    // Step 3: Upload updated JSON back to R2
    const putCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
      Key: tokenId.toString(),
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
    });

    await s3Client.send(putCommand);

    // Step 4: Refresh OpenSea metadata
    const openSeaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_OPENSEA_REFRESH_URL}/${tokenId}/refresh`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_API_KEY,
        },
      }
    );

    if (!openSeaResponse.ok) {
      throw new Error(
        `OpenSea refresh failed: ${
          openSeaResponse.status
        } - ${await openSeaResponse.text()}`
      );
    }

    return true;
  } catch (error) {
    console.error(`Error updating metadata for token ${tokenId}:`, error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tokenIds } = body;

    if (!tokenIds || !Array.isArray(tokenIds)) {
      throw new Error("Invalid token IDs provided");
    }

    // Process tokens sequentially to avoid rate limits
    for (const tokenId of tokenIds) {
      await updateMetadata(tokenId);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${tokenIds.length} tokens`,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
