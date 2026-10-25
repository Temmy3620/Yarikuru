import { use } from "react";
import HistoryClient from "@/components/history/history-client";
import {
	getAvailableYears,
	getYearlyHistoryList,
} from "@/lib/supabase/history";

export const metadata = {
	title: "過去の支出履歴 - YariKuru",
	description: "過去の月別予算と実際の支出を確認し、家計の振り返りを行います。",
};

type YearsType = Awaited<ReturnType<typeof getAvailableYears>>;
type HistoryListType = Awaited<ReturnType<typeof getYearlyHistoryList>>;

export default function HistoryPage() {
	const dataPromise = getAvailableYears().then(async (availableYears) => {
		const defaultYear = availableYears[0] || new Date().getFullYear();
		const initialHistoryList = await getYearlyHistoryList(defaultYear);
		return { availableYears, initialHistoryList, defaultYear };
	});

	return <HistoryPageWrapper dataPromise={dataPromise} />;
}

function HistoryPageWrapper({
	dataPromise,
}: {
	dataPromise: Promise<{
		availableYears: YearsType;
		initialHistoryList: HistoryListType;
		defaultYear: number;
	}>;
}) {
	const { availableYears, initialHistoryList, defaultYear } = use(dataPromise);

	return (
		<HistoryClient
			availableYears={availableYears}
			initialHistoryList={initialHistoryList}
			defaultYear={defaultYear}
		/>
	);
}
