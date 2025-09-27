import React, { useMemo } from 'react';
import { View, StyleSheet} from 'react-native';
import DropdownField from './DropdownField';

type Props = {
	value?: { day: string | null; month: string | null; year: string | null };
	onChange: (next: { day: string | null; month: string | null; year: string | null }) => void;
};

export default function DOBPicker({ value, onChange }: Props) {
	const v = value || { day: null, month: null, year: null };

	const days = useMemo(() => Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) })), []);
	const months = useMemo(() => (
		[
			{ label: 'Jan', value: '1' }, { label: 'Feb', value: '2' }, { label: 'Mar', value: '3' }, { label: 'Apr', value: '4' },
			{ label: 'May', value: '5' }, { label: 'Jun', value: '6' }, { label: 'Jul', value: '7' }, { label: 'Aug', value: '8' },
			{ label: 'Sep', value: '9' }, { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
		]
	), []);
	const years = useMemo(() => {
		const current = new Date().getFullYear();
		const min = current - 80;
		const list: { label: string; value: string }[] = [];
		for (let y = current; y >= min; y -= 1) {
			list.push({ label: String(y), value: String(y) });
		}
		return list;
	}, []);

	return (
		<View style={styles.row}>
			<View style={styles.colSmall}>
				<DropdownField
					value={v.day}
					onChange={(day) => onChange({ ...v, day })}
					placeholder="Day"
					options={days}
				/>
			</View>
			<View style={styles.colMedium}>
				<DropdownField
					value={v.month}
					onChange={(month) => onChange({ ...v, month })}
					placeholder="Month"
					options={months}
				/>
			</View>
			<View style={styles.colLarge}>
				<DropdownField
					value={v.year}
					onChange={(year) => onChange({ ...v, year })}
					placeholder="Year"
					options={years}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	colSmall: {
		flex: 1,
	},
	colMedium: {
		flex: 1.2,
	},
	colLarge: {
		flex: 1.3,
	},
});
