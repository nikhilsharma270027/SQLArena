"use client";
import BattleStatsCircle from "@/src/components/BattleStatsCircle";
import HeadMap from "@/src/components/HeatMapComponent";
import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";

export default function StatisticsPage() {
    const { user } = useAuth();
  return (
    <div className="p-4 mt-10">
      <h1 className="text-2xl font-bold mb-4">My Statistics</h1>
      <p className="text-gray-600">Your SQL performance statistics will be displayed here.</p>

      <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
        <div>
            <Image src={user?.image || ""} alt="Coming Soon" width={100} height={100} className="mx-auto mb-4 rounded-full" />
            <h2 className="text-xl font-semibold text-center">{user?.name}</h2>
            <p className="text-center text-gray-500">{user?.email}</p>
        </div>
        <hr className="my-6" />
        <div className="mt-4 text-center text-gray-500 flex items-center justify-evenly">
            <div className="flex flex-col items-center gap-4">

            <p className="mx-2">Total Problems Solved: <span className="font-medium text-gray-700">0</span></p>
            <p className="mx-2">Current Streak: <span className="font-medium text-gray-700">0 days</span></p>
            <p className="mx-2">Overall Accuracy: <span className="font-medium text-gray-700">100%</span></p>
            </div>
            <div>
                <BattleStatsCircle won={1} played={100} />
            </div>
        </div>


        <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
            <HeadMap />
        </div>
      </div>
    </div>
  );
}