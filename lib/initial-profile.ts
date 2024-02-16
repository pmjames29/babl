import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
    const user = await currentUser();

    // If there is no current user logged in, redirect them to the login page
    if (!user) {
        return redirectToSignIn();
    }

    // Try to find a profile for the current user
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    // If we were able to fetch the profile from the db, return this profile
    if (profile) {
        return profile;
    }

    // Otherwise, create a new profile for the user with their information in the db, then return
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });

    return newProfile;
}