import { Suspense } from 'react';
import ResetPasswordSetup from './resetPasswordSetup';

const ResetPassword= () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordSetup/>
    </Suspense>
  );
};

export default ResetPassword;
