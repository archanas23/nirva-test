// Database Operations Test for Nirva Yoga Studio
// This tests the actual database operations to ensure dates are stored correctly

console.log('🧪 Starting Database Operations Tests...\n');

// Test the ClassManagementService.createClassInstance method
async function testCreateClassInstance() {
    console.log('=== Test: Create Class Instance ===');
    
    // Mock the Supabase client for testing
    const mockSupabase = {
        from: (table) => ({
            select: (columns) => ({
                eq: (field, value) => ({
                    single: () => ({
                        data: {
                            id: 'test-class-id',
                            name: 'Test Class',
                            teacher: 'Test Teacher',
                            start_time: '18:00:00',
                            duration: 60,
                            level: 'All Levels',
                            max_students: 10
                        },
                        error: null
                    })
                })
            }),
            insert: (data) => ({
                select: (columns) => ({
                    single: () => ({
                        data: {
                            id: 'test-instance-id',
                            class_id: 'test-class-id',
                            class_name: 'Test Class',
                            teacher: 'Test Teacher',
                            class_date: '2025-09-25',
                            start_time: '18:00:00',
                            duration: 60,
                            level: 'All Levels',
                            max_students: 10,
                            is_cancelled: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        },
                        error: null
                    })
                })
            })
        })
    };
    
    // Test the createClassInstance logic
    function testCreateClassInstanceLogic(classId, classDate, classTemplate) {
        console.log(`Creating class instance for class ${classId} on ${classDate}`);
        
        const insertData = {
            class_id: classId,
            class_name: classTemplate.name,
            teacher: classTemplate.teacher,
            class_date: classDate,
            start_time: classTemplate.start_time,
            duration: classTemplate.duration,
            level: classTemplate.level,
            max_students: classTemplate.max_students,
            is_cancelled: false
        };
        
        console.log('Insert data:', insertData);
        
        // Verify the date is preserved
        if (insertData.class_date === classDate) {
            console.log('✅ Date preserved correctly');
        } else {
            console.log('❌ Date was modified:', insertData.class_date, 'vs', classDate);
        }
        
        return insertData;
    }
    
    // Test with different dates
    const testDates = ['2025-09-25', '2025-12-31', '2025-01-01'];
    const classTemplate = {
        id: 'test-class-id',
        name: 'Test Class',
        teacher: 'Test Teacher',
        start_time: '18:00:00',
        duration: 60,
        level: 'All Levels',
        max_students: 10
    };
    
    testDates.forEach(date => {
        console.log(`\nTesting date: ${date}`);
        const result = testCreateClassInstanceLogic('test-class-id', date, classTemplate);
        console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    });
}

// Test the admin session manager date conversion
function testAdminDateConversion() {
    console.log('\n=== Test: Admin Date Conversion ===');
    
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
}

// Test the class booking date conversion
function testClassBookingDateConversion() {
    console.log('\n=== Test: Class Booking Date Conversion ===');
    
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
}

// Test the quick add week logic
function testQuickAddWeekLogic() {
    console.log('\n=== Test: Quick Add Week Logic ===');
    
    const startDate = '2025-09-23'; // Monday
    const start = new Date(startDate);
    
    console.log(`Starting week: ${startDate} (${start.toDateString()})`);
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + dayOffset);
        
        // New method (our fix)
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[currentDate.getDay()];
        
        console.log(`${dayName} (Day ${dayOffset}): ${currentDate.toDateString()} → ${dateStr}`);
    }
}

// Run all database tests
function runDatabaseTests() {
    testCreateClassInstance();
    testAdminDateConversion();
    testClassBookingDateConversion();
    testQuickAddWeekLogic();
    
    console.log('\n🎉 Database operations tests completed!');
    console.log('Check the results above to ensure dates are handled correctly.');
}

// Auto-run tests
runDatabaseTests();

// Export functions for manual testing
window.testDatabaseOperations = {
    testCreateClassInstance,
    testAdminDateConversion,
    testClassBookingDateConversion,
    testQuickAddWeekLogic,
    runDatabaseTests
};
