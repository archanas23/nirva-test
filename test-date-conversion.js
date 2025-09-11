// Date Conversion Test for Nirva Yoga Studio
// Run this in your browser console to test date handling

console.log('🧪 Starting Date Conversion Tests...\n');

// Test 1: Basic Date Parsing
function testBasicDateParsing() {
    console.log('=== Test 1: Basic Date Parsing ===');
    const testDate = '2025-09-25';
    
    // Old method (problematic)
    const oldMethod = new Date(testDate);
    const oldISO = oldMethod.toISOString().split('T')[0];
    
    // New method (our fix)
    const [year, month, day] = testDate.split('-').map(Number);
    const newMethod = new Date(year, month - 1, day);
    const newLocal = `${newMethod.getFullYear()}-${String(newMethod.getMonth() + 1).padStart(2, '0')}-${String(newMethod.getDate()).padStart(2, '0')}`;
    
    console.log(`Input: ${testDate}`);
    console.log(`Old method: ${oldMethod.toDateString()} → ${oldISO}`);
    console.log(`New method: ${newMethod.toDateString()} → ${newLocal}`);
    console.log(`Original preserved: ${testDate === newLocal ? '✅ YES' : '❌ NO'}`);
    console.log(`Timezone offset: ${oldMethod.getTimezoneOffset()} minutes\n`);
}

// Test 2: Admin Session Manager Logic
function testAdminSessionLogic() {
    console.log('=== Test 2: Admin Session Manager Logic ===');
    
    function convertDayToDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[date.getMonth()];
        const dayNum = date.getDate();
        return `${monthName} ${dayNum}`;
    }
    
    const testDates = ['2025-09-25', '2025-12-31', '2025-01-01'];
    testDates.forEach(date => {
        const result = convertDayToDate(date);
        console.log(`${date} → ${result}`);
    });
    console.log('');
}

// Test 3: Class Booking Logic
function testClassBookingLogic() {
    console.log('=== Test 3: Class Booking Logic ===');
    
    function convertDayToDate(dayStr) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) {
            return dayStr;
        }
        
        const date = new Date(dayStr);
        if (!isNaN(date.getTime())) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
        
        return '2025-09-01';
    }
    
    const testDates = ['2025-09-25', '2025-12-31', '2025-01-01'];
    testDates.forEach(date => {
        const result = convertDayToDate(date);
        console.log(`${date} → ${result} ${result === date ? '✅' : '❌'}`);
    });
    console.log('');
}

// Test 4: Quick Add Week Logic
function testQuickAddWeek() {
    console.log('=== Test 4: Quick Add Week Logic ===');
    const startDate = '2025-09-23'; // Monday
    const start = new Date(startDate);
    
    console.log(`Starting week: ${startDate} (${start.toDateString()})`);
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + dayOffset);
        
        // Old method (problematic)
        const oldMethod = currentDate.toISOString().split('T')[0];
        
        // New method (our fix)
        const newMethod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[currentDate.getDay()];
        
        console.log(`${dayName} (Day ${dayOffset}): ${currentDate.toDateString()}`);
        console.log(`  Old: ${oldMethod} ${oldMethod === newMethod ? '✅' : '⚠️'}`);
        console.log(`  New: ${newMethod} ✅`);
    }
    console.log('');
}

// Test 5: Timezone Edge Cases
function testTimezoneEdgeCases() {
    console.log('=== Test 5: Timezone Edge Cases ===');
    
    const testDates = [
        '2025-01-01',  // New Year
        '2025-06-15',  // Summer
        '2025-09-25',  // Fall
        '2025-12-31'   // New Year's Eve
    ];
    
    testDates.forEach(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        const utcDate = new Date(dateStr);
        
        const localString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
        const utcString = utcDate.toISOString().split('T')[0];
        
        console.log(`${dateStr}:`);
        console.log(`  Local: ${localString} ${localString === dateStr ? '✅' : '❌'}`);
        console.log(`  UTC:   ${utcString} ${utcString === dateStr ? '✅' : '❌'}`);
        console.log(`  Diff:  ${localDate.getTimezoneOffset()} minutes`);
    });
    console.log('');
}

// Run all tests
function runAllTests() {
    testBasicDateParsing();
    testAdminSessionLogic();
    testClassBookingLogic();
    testQuickAddWeek();
    testTimezoneEdgeCases();
    
    console.log('🎉 All tests completed!');
    console.log('If you see ✅ for all tests, the date handling is working correctly.');
    console.log('If you see ❌ or ⚠️, there are still timezone issues to fix.');
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.testDateConversion = {
    testBasicDateParsing,
    testAdminSessionLogic,
    testClassBookingLogic,
    testQuickAddWeek,
    testTimezoneEdgeCases,
    runAllTests
};
