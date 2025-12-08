"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { filterQueryParams, filterQueryParamsSchema } from "@/lib/types";

export function useOrderQueryParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const paramsObj = Object.fromEntries(searchParams.entries());
	const parsed = filterQueryParamsSchema.safeParse(paramsObj);
	const defaultParams = filterQueryParamsSchema.parse({});

	const didSyncRef = useRef(false);

	const queryParams = parsed.success ? parsed.data : defaultParams;

	const setQueryParams = useCallback(
		(newParams: Partial<filterQueryParams>) => {
			const merged = { ...queryParams, ...newParams };
			const newSearchParams = new URLSearchParams();

			newSearchParams.set("pageIndex", String(merged.pageIndex));
			newSearchParams.set("pageSize", String(merged.pageSize));

			if (Object.keys(merged.filters).length > 0) {
				newSearchParams.set("filters", JSON.stringify(merged.filters));
			} else {
				newSearchParams.delete("filters");
			}

			router.push(`${pathname}?${newSearchParams.toString()}`, {
				scroll: false,
			});
		},
		[queryParams, pathname, router]
	);

	useEffect(() => {
		const hasPageIndex = searchParams.has("pageIndex");
		const hasPageSize = searchParams.has("pageSize");

		if (
			(!hasPageIndex || !hasPageSize || !parsed.success) &&
			!didSyncRef.current
		) {
			didSyncRef.current = true;
			setQueryParams(defaultParams);
		}
	}, [parsed.success, setQueryParams, defaultParams]);

	return {
		queryParams,
		setQueryParams,
	};
}
