'use client';
import React from 'react';
import {Provider} from "react-redux";
import store from "@/truvoicer-base/redux/store";
import {Inter} from "next/font/google";
import GoogleAuthProvider from "@/truvoicer-base/components/providers/GoogleAuthProvider";
import FBAuthProvider from "@/truvoicer-base/components/providers/FBAuthProvider";

const inter = Inter({subsets: ['latin']})

function TruLayout({children}) {
    return (
        <Provider store={store}>
            <GoogleAuthProvider>
                <FBAuthProvider>
                    <body className={inter.className}>{children}</body>
                </FBAuthProvider>
            </GoogleAuthProvider>
        </Provider>
    );
}

export default TruLayout;
