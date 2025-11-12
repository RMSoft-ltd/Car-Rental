"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-slate-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* 404 Visual */}
        <div className="relative">
          <div className="text-[8rem] sm:text-[10rem] font-extrabold text-slate-200 select-none leading-none">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Oops! We couldn’t find that page
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Looks like you’ve wandered off the path — the car or page you’re
            looking for doesn’t exist or might have been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>

          <Link href="/">
            <Button className="flex items-center gap-2 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white">
              <Home className="size-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
