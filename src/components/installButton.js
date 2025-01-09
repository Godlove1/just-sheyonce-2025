'use client';

import Image from "next/image";
import { Button } from "./ui/button";

export default function InstallButton() {
  return (
      <>
            <div
                  id="install-button"
                  onClick={() => pwaless.showWidget("install-prompt")}
                  className="w-full bg-gray-100 p-4"
                >
                  <div className="app_installer w-full flex justify-between items-center">
                    {/* <!-- left --> */}
                    <div className="left flex justify-center items-center ">
                      <div className="logo_app mr-3">
                        <Image width={45} height={45} src="/bg-black.jpg" alt="logo" />
                      </div>
                      <div className="text_install">
                        <div className="app_name boldText text-sm">Sheyonce &trade; </div>
                        <p className="text-xs">Install our app</p>
                      </div>
                    </div>
                    {/* <!-- get_app button --> */}
                    <div className="get_app">
                      <Button size="sm" className="bg-black rounded-sm p-2 text-white">
                        {" "}
                        Install App
                      </Button>
                    </div> 
                  </div>
                </div>
      </>
  )
}
