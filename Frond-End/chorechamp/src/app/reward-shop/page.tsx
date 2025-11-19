import RewardShop from "@/components/rewards/RewardShop";

export default function RewardShopPage() {
    return (
        <section className="cc-stack">
            <div className="cc-card">
                <div className="cc-card-header">
                    <h1 className="cc-card-title">Beloningsshop</h1>
                    <p className="cc-card-subtitle">
                        Wissel je punten in voor beloningen die door het huishoudhoofd zijn
                        ingesteld.
                    </p>
                </div>
            </div>

            <RewardShop />
        </section>
    );
}
