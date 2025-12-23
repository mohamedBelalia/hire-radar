"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopNavbar from "@/components/TopNavbar";
import { searchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSendConnectionRequest } from "@/features/connections/hooks";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("query") || searchParams.get("search") || "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<any>({ employers: [], candidates: [], jobs: [] });
  const [isLoading, setIsLoading] = useState(false);
  const sendRequest = useSendConnectionRequest();
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  useEffect(() => {
    async function doSearch() {
      if (!query) {
        setResults({ employers: [], candidates: [], jobs: [] });
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchApi.search(query || "");
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    doSearch();
  }, [query]);

  useEffect(() => {
    // sync from url
    if (q !== query) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl pt-24">
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Search</p>
          <h1 className="text-3xl font-bold">Find people & roles faster</h1>
          <p className="text-sm text-muted-foreground">
            Search across employers, candidates, and jobs in one place.
          </p>
        </div>

        <form
          className="mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            const term = query.trim();
            const url = term ? `/search?query=${encodeURIComponent(term)}` : "/search";
            router.push(url);
            setQuery(term);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users and jobs..."
            className="w-full rounded-md border border-border p-3 bg-background"
          />
        </form>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Employers</h3>
                  <Badge variant="secondary">{results.employers.length || 0}</Badge>
                </div>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : !query ? (
                  <p className="text-sm text-muted-foreground">Try typing to search employers</p>
                ) : results.employers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No employers found</p>
                ) : (
                  results.employers.map((e: any) => (
                    <div key={e.id} className="py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={e.image || undefined} />
                          <AvatarFallback>{(e.full_name || "E").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {e.full_name}
                            <Badge variant="outline" className="capitalize text-[11px]">{e.role}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {e.headLine || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/connections?userId=${e.id}`)}
                        >
                          View profile
                        </Button>
                        <Button
                          size="sm"
                          disabled={pendingIds.includes(e.id) || sendRequest.isPending}
                          onClick={async () => {
                            setPendingIds((prev) => [...prev, e.id]);
                            try {
                              await sendRequest.mutateAsync(e.id);
                            } finally {
                              setPendingIds((prev) => prev.filter((id) => id !== e.id));
                            }
                          }}
                        >
                          {pendingIds.includes(e.id) || sendRequest.isPending ? "Sending..." : "Connect"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Candidates</h3>
                  <Badge variant="secondary">{results.candidates.length || 0}</Badge>
                </div>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : !query ? (
                  <p className="text-sm text-muted-foreground">Try typing to search candidates</p>
                ) : results.candidates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No candidates found</p>
                ) : (
                  results.candidates.map((c: any) => (
                    <div key={c.id} className="py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={c.image || undefined} />
                          <AvatarFallback>{(c.full_name || "C").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {c.full_name}
                            <Badge variant="outline" className="capitalize text-[11px]">{c.role}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {c.headLine || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/connections?userId=${c.id}`)}
                        >
                          View profile
                        </Button>
                        <Button
                          size="sm"
                          disabled={pendingIds.includes(c.id) || sendRequest.isPending}
                          onClick={async () => {
                            setPendingIds((prev) => [...prev, c.id]);
                            try {
                              await sendRequest.mutateAsync(c.id);
                            } finally {
                              setPendingIds((prev) => prev.filter((id) => id !== c.id));
                            }
                          }}
                        >
                          {pendingIds.includes(c.id) || sendRequest.isPending ? "Sending..." : "Connect"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Jobs</h3>
                  <Badge variant="secondary">{results.jobs.length || 0}</Badge>
                </div>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : !query ? (
                  <p className="text-sm text-muted-foreground">Try typing to search jobs</p>
                ) : results.jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No jobs found</p>
                ) : (
                  results.jobs.map((j: any) => (
                    <div key={j.id} className="py-3 border-b last:border-b-0">
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-3">{j.description}</div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => router.push(`/jobs/${j.id}`)}>View job</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
