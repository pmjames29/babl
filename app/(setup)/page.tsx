import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async() => {
    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    // If a server exists in the db, redirect them to the server
    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    // Otherwise, load the default page
    return <InitialModal />;
}
 
export default SetupPage;