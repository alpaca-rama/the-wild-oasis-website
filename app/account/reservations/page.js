import Link from "next/link";
import { getBookings, getGuest, createGuest } from "@/app/_lib/data-service";
import { auth } from "@/app/_lib/auth";
import ReservationList from "@/app/_components/ReservationList";

export const metadata = {
    title: 'Reservations | Account',
}

export default async function Page() {
    const session = await auth();
    console.log('Session user:', session?.user);

    // Get guest directly from database
    const guest = await getGuest(session.user.email);
    console.log('Guest from database:', guest);

    if (!guest) {
        // If guest doesn't exist, create them
        const newGuest = await createGuest({
            email: session.user.email,
            full_name: session.user.name
        });
        console.log('Created new guest:', newGuest);
        const bookings = await getBookings(newGuest.id);
        return (
            <div>
                <h2 className="font-semibold text-2xl text-accent-400 mb-7">
                    Your reservations
                </h2>
                <p className="text-lg">
                    You have no reservations yet. Check out our{" "}
                    <Link className="underline text-accent-500" href="/cabins">
                        luxury cabins &rarr;
                    </Link>
                </p>
            </div>
        );
    }

    const bookings = await getBookings(guest.id);

    return (
        <div>
            <h2 className="font-semibold text-2xl text-accent-400 mb-7">
                Your reservations
            </h2>

            {bookings.length === 0 ? (
                <p className="text-lg">
                    You have no reservations yet. Check out our{" "}
                    <Link className="underline text-accent-500" href="/cabins">
                        luxury cabins &rarr;
                    </Link>
                </p>
            ) : (
                <ReservationList bookings={bookings} />
            )}
        </div>
    );
}
