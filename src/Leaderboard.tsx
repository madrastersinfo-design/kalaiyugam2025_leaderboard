import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./assets/madrasters-logo.svg";
import TitleLogo from "./assets/kalaiyugam.svg";
import FlowerLeft from "./assets/mara.png";
import FlowerRight from "./assets/conc.png";
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
                const json = await response.json() as { data: LeaderboardEntry[] };

                // 🔥 FIX: Convert validDays & invalidDays to numbers
                const normalized = json.data.map((u) => ({
                    ...u,
                    validDays: u.validDays.map((d) => Number(d)),
                    invalidDays: u.invalidDays.map((d) => Number(d)),
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

    /** BADGES */
    const mapToDisplayLevel = (badge: number): 1 | 2 => {
        return badge <= 1 ? 1 : 2;
    };

    const getBadgeAccent = (badge: number): string => {
        return mapToDisplayLevel(badge) === 1 ? "🌱" : "🌸";
    };

    /** TICK / X / LATE ICON */
    const getDayStatus = (day: number, user: LeaderboardEntry) => {
        if (user.validDays.includes(day)) {
            return { icon: "✔️", class: "day-success" };
        }
        if (user.invalidDays.includes(day)) {
            return { icon: "⏰", class: "day-late" };
        }
        return { icon: "❌", class: "day-fail" };
    };

    /** SORT USERS */
    const sortedUsers = [...leaderboardData].sort((a, b) => b.sortValue - a.sortValue);

    if (isLoading) {
        return (
            <div className="page">
                <div className="background leaderboard-page">
                    <img className="flower-left" src={FlowerLeft} alt="" />
                    <img className="flower-right" src={FlowerRight} alt="" />
                    <img className="brand-logo" src={BrandLogo} alt="" />
                    <img className="title-logo" src={TitleLogo} alt="" />
                    <div className="leaderboard-card loading">
                        <div className="lds-roller">Loading…</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="background leaderboard-page">
                <img className="flower-left" src={FlowerLeft} />
                <img className="flower-right" src={FlowerRight} />
                <img className="brand-logo" src={BrandLogo} />
                <img className="title-logo" src={TitleLogo} />

                <button
                    type="button"
                    className="leaderboard-nav-button"
                    onClick={() => navigate('/')}
                >
                    Submit Entry 🌸
                </button>

                <div className="leaderboard-card">
                    <div className="leaderboard-card-header">
                        <h2 className="leaderboard-title">Leaderboard</h2>
                    </div>

                    <div className="leaderboard-list">
                        {sortedUsers.map((user) => {
                            const displayLevel = mapToDisplayLevel(user.badge);

                            // Only show number of past days = valid + invalid
                            const totalDaysToShow =
                                user.validDays.length + user.invalidDays.length || 1;

                            return (
                                <div key={user.instaId} className="leaderboard-row-wrapper">
                                    <div className="leaderboard-row">
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

                                                    <span
                                                        className={`profile-level level-chip ${displayLevel === 1 ? "level-1" : "level-2"
                                                            }`}
                                                    >
                                                        {displayLevel === 1 ? "Level 01" : "Level 02"}
                                                    </span>
                                                </div>

                                                {/* PROGRESS ROW */}
                                                <div className="day-status-row">
                                                    {allowedDays.slice(0, totalDaysToShow).map((day, index) => {
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

                                        <div className="leaderboard-row-accent">
                                            <span className="leaderboard-row-accent__emoji">
                                                {getBadgeAccent(user.badge)}
                                            </span>
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
