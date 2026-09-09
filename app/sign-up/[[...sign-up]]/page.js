import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8 pt-28 md:pl-[216px] md:pt-8">
      <SignUp path="/sign-up" routing="path" fallbackRedirectUrl="/portal" />
    </div>
  );
}
