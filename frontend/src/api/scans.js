import api from './apiClient';

const SCANS_SERVICE_URL = 'http://localhost:4200/api/scans';

export const getScansByPatient = async (patientId) => {
    return api.get(`${SCANS_SERVICE_URL}/patient/${patientId}`);
};

export const uploadScan = async (formData) => {
    return api.post(`${SCANS_SERVICE_URL}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteScan = async (id) => {
    return api.delete(`${SCANS_SERVICE_URL}/${id}`);
};

export const getScanStreamUrl = (id) => `${SCANS_SERVICE_URL}/${id}/stream`;
export const getScanDownloadUrl = (id) => `${SCANS_SERVICE_URL}/${id}/download`;
