// src/app/chores/page.tsx
import ChoreForm from "@/components/chores/ChoreForm";
import ChoreList from "@/components/chores/ChoreList";

export default function ChoresPage() {
    return (
        <section className="mx-auto max-w-3xl space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Takenbeheer</h1>
                <p className="text-sm text-neutral-500">
                    Voeg nieuwe taken toe en vink af wat gedaan is.
                </p>
            </header>

            <ChoreForm onCreated={() => window.location.reload()} />
            <ChoreList />
        </section>
    );
}
