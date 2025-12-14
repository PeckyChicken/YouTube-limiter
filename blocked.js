            document.addEventListener('DOMContentLoaded', () => {
                const el = document.getElementById('timer');

                function pad(n){ return String(n).padStart(2, '0'); }

                function update() {
                    const now = new Date();
                    const nextMidnight = new Date(now);
                    nextMidnight.setHours(24, 0, 0, 0); // next local midnight
                    const diff = nextMidnight - now;

                    if (diff <= 0) {
                        el.textContent = '00:00:00';
                        return;
                    }

                    const totalSeconds = Math.floor(diff / 1000);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;

                    el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                }

                update();
                setInterval(update, 1000);
            });