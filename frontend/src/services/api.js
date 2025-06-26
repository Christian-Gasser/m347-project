const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (config.method === 'DELETE') {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Space endpoints
  async getSpaces() {
    return this.request('/api/spaces');
  }

  async getSpace(spaceId) {
    return this.request(`/api/spaces/${spaceId}`);
  }

  async createSpace(spaceData) {
    return this.request('/api/spaces', {
      method: 'POST',
      body: spaceData,
    });
  }

  async updateSpace(spaceId, spaceData) {
    return this.request(`/api/spaces/${spaceId}`, {
      method: 'PUT',
      body: spaceData,
    });
  }

  async deleteSpace(spaceId) {
    return this.request(`/api/spaces/${spaceId}`, {
      method: 'DELETE',
    });
  }

  // Semester endpoints
  async getSemesters(spaceId) {
    return this.request(`/api/spaces/${spaceId}/semesters`);
  }

  async getSemester(spaceId, semesterId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}`);
  }

  async createSemester(spaceId, semesterData) {
    return this.request(`/api/spaces/${spaceId}/semesters`, {
      method: 'POST',
      body: semesterData,
    });
  }

  async updateSemester(spaceId, semesterId, semesterData) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}`, {
      method: 'PUT',
      body: semesterData,
    });
  }

  async deleteSemester(spaceId, semesterId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}`, {
      method: 'DELETE',
    });
  }

  // Subject endpoints
  async getSubjects(spaceId, semesterId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects`);
  }

  async getSubject(spaceId, semesterId, subjectId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}`);
  }

  async createSubject(spaceId, semesterId, subjectData) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects`, {
      method: 'POST',
      body: subjectData,
    });
  }

  async updateSubject(spaceId, semesterId, subjectId, subjectData) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}`, {
      method: 'PUT',
      body: subjectData,
    });
  }

  async deleteSubject(spaceId, semesterId, subjectId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}`, {
      method: 'DELETE',
    });
  }

  // Grade endpoints
  async getGrades(spaceId, semesterId, subjectId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}/grades`);
  }

  async getGrade(spaceId, semesterId, subjectId, gradeId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}/grades/${gradeId}`);
  }

  async createGrade(spaceId, semesterId, subjectId, gradeData) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}/grades`, {
      method: 'POST',
      body: gradeData,
    });
  }

  async updateGrade(spaceId, semesterId, subjectId, gradeId, gradeData) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}/grades/${gradeId}`, {
      method: 'PUT',
      body: gradeData,
    });
  }

  async deleteGrade(spaceId, semesterId, subjectId, gradeId) {
    return this.request(`/api/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}/grades/${gradeId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();