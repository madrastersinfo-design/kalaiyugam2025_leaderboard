import { useEffect, useState } from "react";
import BrandLogo from "./assets/madrasters-logo.svg";
import TitleLogo from "./assets/kalaiyugam.svg";
import FlowerLeft from "./assets/mara.png";
import FlowerRight from "./assets/conc.png";
import { useNavigate } from "react-router-dom";
import "./App.css";

type LeaderboardEntry = {
    fullName: string;
    instaId: string;
    streak: number;
    level: number;
    badge: number;
    sortValue: number;
    validDays: number[];
    invalidDays: number[];
};

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycby7CSkz1Ib5z3gSH9nuNUj3HMPsoYt2e5tgLS5xYdzPwjRTfa88cN9aEQM1GX3wCbQw/exec";

    const allowedDays = [15, 16, 17, 18, 19, 20, 21];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(GOOGLE_SCRIPT_URL);
                const json = await response.json();

                const normalized = json.data.map((u: any) => ({
                    ...u,
                    validDays: u.validDays.map((d: any) => Number(d)),
                    invalidDays: u.invalidDays.map((d: any) => Number(d)),
                }));

                setLeaderboardData(normalized);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getDayStatus = (day: number, user: LeaderboardEntry) => {
        if (user.validDays.includes(day)) {
            return { icon: "✔️", class: "day-success" };
        }
        if (user.invalidDays.includes(day)) {
            return { icon: "⏰", class: "day-late" };
        }
        return { icon: "❌", class: "day-fail" };
    };

    const sortedUsers = [...leaderboardData].sort((a, b) => b.streak - a.streak);

    if (isLoading) {
        return <div className="page"><div className="leaderboard-card loading">Loading…</div></div>;
    }

    return (
        <div className="page">
            <div className="background">
                <img className="flower-left" src={FlowerLeft} />
                <img className="flower-right" src={FlowerRight} />
                <img className="brand-logo" src={BrandLogo} />
                <img className="title-logo" src={TitleLogo} />

                <button
                    type="button"
                    className="leaderboard-nav-button"
                    onClick={() => navigate('/')}
                >
                    ← Back to Submit Form
                </button>

                <div className="leaderboard-card">
                    <div className="leaderboard-card-header">
                        <h2 className="leaderboard-title">Leaderboard</h2>
                    </div>

                    <div className="leaderboard-list">
                        {sortedUsers.map((user) => {

                            const allDays = [...user.validDays, ...user.invalidDays];
                            const maxUploadedDay =
                                allDays.length > 0 ? Math.max(...allDays) : allowedDays[0];

                            const daysToShow = allowedDays.filter((d) => d <= maxUploadedDay);

                            return (
                                <div key={user.instaId} className="leaderboard-row-wrapper">
                                    <div className="leaderboard-row">

                                        {/* LEFT SIDE */}
                                        <div className="profile-container">
                                            <div className="profile-info">
                                                <div className="profile-name">{user.fullName}</div>

                                                <div className="profile-tags">
                                                    <span
                                                        className="profile-handle"
                                                        onClick={() =>
                                                            window.open(
                                                                `https://instagram.com/${user.instaId}`,
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        @{user.instaId}
                                                    </span>
                                                </div>

                                                {/* DAY STATUS */}
                                                <div className="day-status-row">
                                                    {daysToShow.map((day, index) => {
                                                        const status = getDayStatus(day, user);
                                                        return (
                                                            <span
                                                                key={day}
                                                                className={`day-status-box ${status.class}`}
                                                            >
                                                                Day {index + 1} {status.icon}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE —🔥 STREAK DISPLAY */}
                                        <div className="leaderboard-row-accent">
                                            {user.streak > 0 && (
                                                <span className="streak-display">
                                                    🔥 {user.streak} Streaks
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                    <div className="divider" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
