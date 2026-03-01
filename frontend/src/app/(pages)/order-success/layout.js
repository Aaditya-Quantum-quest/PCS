import { Suspense } from 'react';

export default function OrderSuccessLayout({ children }) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
