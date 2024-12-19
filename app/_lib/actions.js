'use server';

import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "@/app/_lib/data-service";
import { redirect } from "next/navigation";

export async function updateProfile(formData) {
    const session = await auth();
    if (!session) throw new Error('You must be logged in');

    const national_id = formData.get('national_id');;
    const [nationality, country_flag] = formData.get('nationality').split('%');
    if (!/^[a-zA-Z0-9]{6,12}$/.test(national_id)) throw new Error('Please provide a valid national ID');

    const updateData = { nationality, country_flag, national_id };

    const { data, error } = await supabase
        .from('two_guests')
        .update(updateData)
        .eq('id', session.user.guest_id);
    if (error) throw new Error('Guest could not be updated');

    revalidatePath('/account/profile');
}

export async function deleteReservation(bookingId) {
    // await new Promise((res) => setTimeout(res, 2000));
    // throw new Error();

    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const guestBookings = await getBookings(session.user.guest_id);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
        throw new Error("You are not allowed to delete this booking");

    const { error } = await supabase
        .from("two_bookings")
        .delete()
        .eq("id", bookingId);

    if (error) throw new Error("Booking could not be deleted");

    revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
    const bookingId = Number(formData.get('bookingId'));

    // 1) Authentication
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    // 2) Authorization
    const guestBookings = await getBookings(session.user.guest_id);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
        throw new Error("You are not allowed to update this booking");

    // 3) Building update data
    const updateData = {
        num_guests: Number(formData.get('num_guests')),
        observations: formData.get('observations').slice(0, 1000),
    }

    // 4) update mutation
    const { error } = await supabase
        .from('two_bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();

    // 5) Error handling
    if (error) throw new Error('Booking could not be updated');

    // 6) Revalidate
    revalidatePath(`/account/reservations/${bookingId}`);
    revalidatePath('/account/reservations');

    // 7) Redirecting
    redirect('/account/reservations');
}

export async function createBooking(bookingData, formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const newBooking = {
        ...bookingData,
        guest_id: session.user.guest_id,
        num_guests: Number(formData.get('num_guests')),
        observations: formData.get('observations').slice(0, 1000),
        extras_price: 0,
        total_price: bookingData.cabin_price,
        is_paid: false,
        has_breakfast: false,
        status: 'unconfirmed'
    }

    // console.log(newBooking);

    const { error } = await supabase
        .from('two_bookings')
        .insert([newBooking])

    if (error) throw new Error('Booking could not be created');

    revalidatePath(`cabins/${bookingData.cabin_id}`);

    redirect('/cabins/thankyou');
}

export async function signInAction() {
    await signIn('google', {
        redirectTo: '/account'
    });
}

export async function signOutAction() {
    await signOut({
        redirectTo: '/'
    }
    );
}