'use client';

import {useState} from "react";
import {updateProfile} from "@/app/_lib/actions";
import SubmitButton from "@/app/_components/SubmitButton";

export default function UpdateProfileForm({guest, children}) {
    const [count, setCount] = useState();
    const {full_name, email, nationality, national_id, country_flag} = guest;

    // CHANGE
    // const countryFlag = "pt.jpg";
    // const countryFlag = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg";
    // const nationality = "portugal";

    return (
        <form
            action={updateProfile}
            className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        >
            <div className="space-y-2">
                <label>Full name</label>
                <input
                    disabled
                    defaultValue={full_name}
                    name={'full_name'}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label>Email address</label>
                <input
                    disabled
                    defaultValue={email}
                    name={'email'}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>
                    <img
                        src={country_flag}
                        alt="Country flag"
                        className="h-5 rounded-sm"
                    />
                </div>
                {children}
            </div>

            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    defaultValue={national_id}
                    name={'national_id'}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                />
            </div>

            <div className="flex justify-end items-center gap-6">
                <SubmitButton pendingLabel={'Updating...'}>
                    Update Profile
                </SubmitButton>
            </div>
        </form>
    )
}