import { eachDayOfInterval } from 'date-fns';
import { supabase } from "@/app/_lib/supabase";
import { notFound } from "next/navigation";

/////////////
// GET

export async function getCabin(id) {
    const { data, error } = await supabase
        .from('two_cabins')
        .select('*')
        .eq('id', id)
        .single();

    // For testing
    // await new Promise((res) => setTimeout(res, 1000));

    if (error) {
        console.error(error);
        notFound();
    }

    return data;
}

export async function getCabinPrice(id) {
    const { data, error } = await supabase
        .from('two_cabins')
        .select('regular_price, discount')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
    }

    return data;
}

export const getCabins = async function () {
    const { data, error } = await supabase
        .from('two_cabins')
        .select('id, name, max_capacity, regular_price, discount, image')
        .order('name');

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be loaded');
    }

    return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
    const { data, error } = await supabase
        .from('two_guests')
        .select('*')
        .eq('email', email)
        .single();

    // No error here! We handle the possibility of no guest in the sign in callback
    return data;
}

export async function getBooking(id) {
    const { data, error, count } = await supabase
        .from('two_bookings')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not get loaded');
    }

    return data;
}

export async function getBookings(guestId) {
    if (!guestId) {
        console.error('No guestId provided to getBookings');
        throw new Error('Guest ID is required');
    }

    console.log('Fetching bookings for guestId:', guestId);

    const { data, error } = await supabase
        .from('two_bookings')
        .select(`
            id,
            created_at,
            start_date,
            end_date,
            num_nights,
            num_guests,
            total_price,
            guest_id,
            cabin_id,
            two_cabins (
                name,
                image
            )
        `)
        .eq('guest_id', guestId);

    if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Bookings could not get loaded: ${error.message}`);
    }

    console.log('Bookings found:', data);
    return data;
}

export async function getBookedDatesByCabinId(cabinId) {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today = today.toISOString();

    // Getting all bookings
    const { data, error } = await supabase
        .from('two_bookings')
        .select('*')
        .eq('cabin_id', cabinId)
        .or(`start_date.gte.${today},status.eq.checked-in`);

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }

    // Converting to actual dates to be displayed in the date picker
    const bookedDates = data
        .map((booking) => {
            return eachDayOfInterval({
                start: new Date(booking.start_date),
                end: new Date(booking.end_date),
            });
        })
        .flat();

    return bookedDates;
}

export async function getSettings() {
    const { data, error } = await supabase.from('two_settings').select('*').single();

    if (error) {
        console.error(error);
        throw new Error('Settings could not be loaded');
    }

    return data;
}

export async function getCountries() {
    try {
        // const res = await fetch('https://restcountries.com/v2/all?fields=name,flag');
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const countries = await res.json();
        return countries.data;
    } catch {
        throw new Error('Could not fetch countries');
    }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
    const { data, error } = await supabase
        .from('two_guests')
        .insert([newGuest])
        .select()
        .single();

    if (error) {
        console.error('Error creating guest:', error);
        throw new Error('Guest could not be created');
    }

    return data;
}

export async function createBooking(newBooking) {
    const { data, error } = await supabase
        .from('two_bookings')
        .insert([newBooking])
        // So that the newly created object gets returned!
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be created');
    }

    return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
    const { data, error } = await supabase
        .from('two_guests')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Guest could not be updated');
    }
    return data;
}

export async function updateBooking(id, updatedFields) {
    const { data, error } = await supabase
        .from('two_bookings')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be updated');
    }
    return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
    const { data, error } = await supabase.from('two_bookings').delete().eq('id', id);

    if (error) {
        console.error(error);
        throw new Error('Booking could not be deleted');
    }
    return data;
}
