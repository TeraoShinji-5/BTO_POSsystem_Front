"use client";
import React, { Suspense } from 'react';
import Mychoice from './../components/Choice/Mychoice';

export default function Shopping() {
  return (
      <main>
        <Suspense>
          <Mychoice />
          </Suspense>
      </main>
  );
}