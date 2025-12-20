import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { LoaderIcon } from 'lucide-react';
import { oAuth } from '@/features/auth/api';

const OAuth = () => {

    const [loading, setLoading] = useState(false);

  const oAuthGoogle = async () => {
    try {
      setLoading(true);
      const res = await oAuth();
      
      if (res.status === 200) {
        window.location.href = res.data.auth_url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
        <Button
            variant="outline"
            className="cursor-pointer text-sm  w-[200px] flex items-center gap-2"
            onClick={oAuthGoogle}
            disabled={loading}
        >
            {loading ? (
            <div className="flex gap-2 justify-center">
                <LoaderIcon className="animate-spin" /> <span>Loading...</span>
            </div>
            ) : (
            <>
                <Image
                src={"/icons/google.svg"}
                width={20}
                height={20}
                alt="google icon"
                />
                <span>Sign in with Google</span>
            </>
            )}
        </Button>
    )
}

export default OAuth