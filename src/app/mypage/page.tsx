"use client";
import React, { Suspense } from 'react';
import Mychoice from './../components/Choice/MyChoice';

export default function Shopping() {
  return (
      <main>
        <Suspense>
          <MyChoice />
          </Suspense>
      </main>
  );
}
