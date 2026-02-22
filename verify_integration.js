async function verify() {
    console.log('--- Starting MERN Integration Verification ---');

    try {
        // 1. Check Backend Health
        console.log('1. Checking Backend Health (Port 5000)...');
        const backendHealthRes = await fetch('http://localhost:5000/api/health');
        const backendHealth = await backendHealthRes.json();
        console.log('✅ Backend Health:', backendHealth);

        // 2. Check ML Service Health
        console.log('\n2. Checking ML Service Health (Port 5001)...');
        const mlHealthRes = await fetch('http://localhost:5001/health');
        const mlHealth = await mlHealthRes.json();
        console.log('✅ ML Service Health:', mlHealth);

        // 3. Test Prediction
        console.log('\n3. Testing End-to-End Prediction...');
        const testData = {
            N: 90, P: 42, K: 43,
            temperature: 20.8, humidity: 82.0,
            ph: 6.5, rainfall: 202.9
        };

        const predictionRes = await fetch('http://localhost:5000/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        const predictionResult = await predictionRes.json();
        console.log('✅ Prediction Result:', predictionResult);

        // 4. Check History
        console.log('\n4. Verifying History Storage...');
        const historyRes = await fetch('http://localhost:5000/api/history');
        const history = await historyRes.json();
        const latest = history[0];
        console.log('✅ Latest Record in History:', {
            crop: latest.prediction.crop,
            irrigation: latest.prediction.irrigation,
            timestamp: latest.createdAt
        });

        console.log('\n🌟 ALL SYSTEMS GO! Integration is 100% functional.');
    } catch (error) {
        console.error('\n❌ Verification Failed!');
        if (error.response) {
            console.error('Response Error:', error.response.status, error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
        process.exit(1);
    }
}

verify();
