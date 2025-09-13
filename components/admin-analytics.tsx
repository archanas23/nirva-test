import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Users, Clock, User, Mail, Filter, Download, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Booking {
  id: string;
  user_id: string;
  class_name: string;
  teacher: string;
  class_date: string;
  class_time: string;
  booked_at: string;
  is_cancelled: boolean;
  cancelled_at: string | null;
  class_instance_id: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export function AdminAnalytics() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Loading bookings with filter:', filter);
      
      let query = supabase
        .from('user_booked_classes')
        .select(`
          id,
          user_id,
          class_name,
          teacher,
          class_date,
          class_time,
          booked_at,
          is_cancelled,
          cancelled_at,
          class_instance_id,
          user:users(name, email)
        `)
        .order('booked_at', { ascending: false });

      // Apply filter
      if (filter === 'active') {
        query = query.eq('is_cancelled', false);
      } else if (filter === 'cancelled') {
        query = query.eq('is_cancelled', true);
      }
      // 'all' shows everything

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error loading bookings:', error);
        throw error;
      }
      
      console.log('✅ Loaded bookings:', data?.length || 0);
      console.log('🔍 Sample booking data:', data?.[0]);
      
      // Transform the data to match our interface
      const transformedData = (data || []).map((booking: any) => {
        console.log('🔍 Processing booking:', {
          id: booking.id,
          user_id: booking.user_id,
          user_data: booking.user,
          class_name: booking.class_name
        });
        
        return {
          ...booking,
          user: booking.user?.[0] || null // Supabase returns user as array, take first element
        };
      });
      
      console.log('✅ Transformed bookings:', transformedData.slice(0, 2));
      setBookings(transformedData);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || booking.class_date === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const exportBookings = () => {
    const csvContent = [
      ['Class Name', 'Teacher', 'Date', 'Time', 'Student Name', 'Student Email', 'Booked At', 'Status'].join(','),
      ...filteredBookings.map(booking => [
        booking.class_name,
        booking.teacher,
        booking.class_date,
        booking.class_time,
        booking.user?.name || 'Unknown',
        booking.user?.email || 'Unknown',
        formatDateTime(booking.booked_at),
        booking.is_cancelled ? 'Cancelled' : 'Active'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => !b.is_cancelled).length,
    cancelled: bookings.filter(b => b.is_cancelled).length,
    today: bookings.filter(b => b.class_date === new Date().toISOString().split('T')[0]).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Class Analytics</h2>
          <p className="text-muted-foreground">View all class bookings and student details</p>
        </div>
        <Button onClick={exportBookings} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by class, teacher, or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40"
                placeholder="Filter by date"
              />
              
              <Button onClick={loadBookings} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchTerm || dateFilter 
                  ? 'Try adjusting your search filters' 
                  : 'No bookings have been made yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className={booking.is_cancelled ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{booking.class_name}</h3>
                      <Badge variant={booking.is_cancelled ? 'destructive' : 'default'}>
                        {booking.is_cancelled ? 'Cancelled' : 'Active'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {booking.user?.name || `User ${booking.user_id?.slice(0, 8)}...`}
                          </p>
                          <p className="text-muted-foreground">
                            {booking.user?.email || `ID: ${booking.user_id}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{formatDate(booking.class_date)}</p>
                          <p className="text-muted-foreground">{formatTime(booking.class_time)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{booking.teacher}</p>
                          <p className="text-muted-foreground">Instructor</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Booked {formatDateTime(booking.booked_at)}</p>
                          {booking.cancelled_at && (
                            <p className="text-muted-foreground">
                              Cancelled {formatDateTime(booking.cancelled_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
