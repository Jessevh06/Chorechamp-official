import MemberChoreList from "@/components/chores/MemberChoreList";

export default function MyChoresPage() {
    return (
        <section className="cc-stack">
            <div className="cc-card">
                <div className="cc-card-header">
                    <h1 className="cc-card-title">Mijn taken</h1>
                    <p className="cc-card-subtitle">
                        Zie welke taken jij kunt doen of al hebt gedaan.
                    </p>
                </div>
            </div>

            <MemberChoreList />
        </section>
    );
}
