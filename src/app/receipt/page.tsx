"use client";
import React, { Suspense } from 'react';
import Messaging from './../components/Message/Messaging';

export default function Message() {
  return (
      <main>
        <Suspense>
          <Messaging />
          </Suspense>
      </main>
  );
}