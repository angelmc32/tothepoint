import React from "react";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { museoModernoFont } from "~~/lib/fonts/fonts";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-4 px-4 lg:mb-0">
      <div className="w-full flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
        <div className="flex justify-center items-center w-full md:w-1/3 pointer-events-none space-x-8">
          {nativeCurrencyPrice > 0 && (
            <div>
              <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>{nativeCurrencyPrice}</span>
              </div>
            </div>
          )}
          <SwitchTheme className={`md:hidden pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
        <ul className={`menu menu-horizontal w-full md:w-1/3 md:flex md:justify-center ${museoModernoFont.className}`}>
          <div className="flex justify-center items-center gap-2 text-sm w-full md:w-auto">
            encorto 2024 ©<span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">frutero club</p>
            </div>
          </div>
        </ul>
        <div className="md:block hidden md:w-1/3">
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      </div>
    </div>
  );
};
